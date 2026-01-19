import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/apiAuth';
import { defaultSettings, getSettings, upsertSettings } from '@/lib/db/settings';

export const runtime = 'nodejs';

export async function GET(request) {
  const user = await getAuthUser(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const settings = await getSettings(user.id);
  if (!settings) {
    const created = await upsertSettings(user.id, {});
    return NextResponse.json({ settings: created });
  }

  return NextResponse.json({ settings });
}

export async function PATCH(request) {
  const user = await getAuthUser(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const { timeFormat, weekStartDay, theme, defaultBillable } = body;

  if (timeFormat && !['12h', '24h'].includes(timeFormat)) {
    return NextResponse.json({ error: 'timeFormat must be 12h or 24h.' }, { status: 400 });
  }

  const parsedWeekStart =
    weekStartDay === undefined || weekStartDay === null
      ? undefined
      : Number(weekStartDay);

  if (parsedWeekStart !== undefined && ![0, 1].includes(parsedWeekStart)) {
    return NextResponse.json({ error: 'weekStartDay must be 0 or 1.' }, { status: 400 });
  }

  if (theme && !['light', 'dark', 'system'].includes(theme)) {
    return NextResponse.json({ error: 'theme must be light, dark, or system.' }, { status: 400 });
  }

  if (defaultBillable !== undefined && typeof defaultBillable !== 'boolean') {
    return NextResponse.json({ error: 'defaultBillable must be boolean.' }, { status: 400 });
  }

  const settings = await upsertSettings(user.id, {
    timeFormat,
    weekStartDay: parsedWeekStart,
    theme,
    defaultBillable,
  });

  return NextResponse.json({ settings });
}
