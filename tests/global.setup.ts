import { clerkSetup } from '@clerk/testing/playwright';
import { test as setup } from '@playwright/test';

import * as dotenv from 'dotenv';
dotenv.config({ path: '.env' });
dotenv.config({ path: '.env.local' });

setup('global setup', async () => {
  await clerkSetup();
});
