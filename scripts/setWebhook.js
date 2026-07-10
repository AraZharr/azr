#!/usr/bin/env node

/**
 * CLOVER — Set Telegram Webhook
 * Run this after deploying to Vercel to register the webhook URL.
 *
 * Usage:
 *   node scripts/setWebhook.js
 *   node scripts/setWebhook.js --delete    (remove webhook)
 *   node scripts/setWebhook.js --info      (check current webhook)
 */

// Load env from .env.local if running locally
import { config } from 'process';

const args    = process.argv.slice(2);
const MODE    = args[0] || '--set';

const TOKEN   = process.env.TELEGRAM_BOT_TOKEN;
const SECRET  = process.env.TELEGRAM_WEBHOOK_SECRET;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL;

// ── VALIDATE ─────────────────────────────────────────────────

if (!TOKEN) {
  console.error('❌ TELEGRAM_BOT_TOKEN is not set.');
  console.error('   Copy .env.example to .env.local and fill in your values.');
  process.exit(1);
}

const BASE = `https://api.telegram.org/bot${TOKEN}`;

// ── HELPERS ───────────────────────────────────────────────────

async function tgCall(method, body = {}) {
  const res  = await fetch(`${BASE}/${method}`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(body),
  });
  return res.json();
}

function printResult(label, result) {
  if (result.ok) {
    console.log(`✅ ${label}`);
    if (result.result && typeof result.result === 'object') {
      console.log('   ', JSON.stringify(result.result, null, 2).split('\n').join('\n    '));
    } else if (result.result) {
      console.log('   ', result.result);
    }
  } else {
    console.error(`❌ ${label} failed:`, result.description);
  }
}

// ── MAIN ──────────────────────────────────────────────────────

async function main() {
  console.log('\n🍀 CLOVER — Telegram Webhook Manager\n');

  // ── GET BOT INFO ─────────────────────────────────────────
  const botInfo = await tgCall('getMe');
  if (!botInfo.ok) {
    console.error('❌ Invalid TELEGRAM_BOT_TOKEN. Check your .env.local');
    process.exit(1);
  }
  console.log(`🤖 Bot: @${botInfo.result.username} (${botInfo.result.first_name})`);

  // ── INFO MODE ────────────────────────────────────────────
  if (MODE === '--info') {
    console.log('\n📡 Current webhook info:\n');
    const info = await tgCall('getWebhookInfo');
    printResult('Webhook info', info);
    return;
  }

  // ── DELETE MODE ──────────────────────────────────────────
  if (MODE === '--delete') {
    console.log('\n🗑️  Deleting webhook...\n');
    const result = await tgCall('deleteWebhook', { drop_pending_updates: true });
    printResult('Webhook deleted', result);
    return;
  }

  // ── SET MODE (default) ───────────────────────────────────
  if (!APP_URL) {
    console.error('\n❌ NEXT_PUBLIC_APP_URL is not set.');
    console.error('   Set it to your Vercel deployment URL.');
    console.error('   Example: https://clover-bot.vercel.app\n');
    process.exit(1);
  }

  const webhookUrl = `${APP_URL.replace(/\/$/, '')}/api/webhook/telegram`;
  console.log(`\n📡 Setting webhook to:\n   ${webhookUrl}\n`);

  const setResult = await tgCall('setWebhook', {
    url:                  webhookUrl,
    secret_token:         SECRET || undefined,
    allowed_updates:      ['message', 'callback_query'],
    drop_pending_updates: true,
    max_connections:      40,
  });

  printResult('Webhook set', setResult);

  // Verify
  console.log('\n🔍 Verifying...\n');
  const verify = await tgCall('getWebhookInfo');

  if (verify.ok) {
    const w = verify.result;
    console.log(`   URL:              ${w.url}`);
    console.log(`   Has secret token: ${w.has_custom_certificate || !!SECRET ? '✅' : '❌'}`);
    console.log(`   Pending updates:  ${w.pending_update_count}`);
    if (w.last_error_message) {
      console.warn(`   Last error: ${w.last_error_message}`);
    }
  }

  console.log('\n✅ Done! Your bot is ready to receive messages.\n');
}

main().catch((err) => {
  console.error('❌ Unexpected error:', err.message);
  process.exit(1);
});
