import { model } from '@platforma-open/milaboratories.vj-usage.model';
import { defineApp } from '@platforma-sdk/ui-vue';
import JUsage from './pages/JUsage.vue';
import VJUsage from './pages/VJUsage.vue';
import VUsage from './pages/VUsage.vue';

export const sdkPlugin = defineApp(model, () => {
  return {
    routes: {
      '/': () => VUsage,
      '/jUsage': () => JUsage,
      '/vjUsage': () => VJUsage,
    },
  };
});

export const useApp = sdkPlugin.useApp;
