import { model } from '@platforma-open/milaboratories.vj-usage.model';
import { defineApp } from '@platforma-sdk/ui-vue';
import { watch } from 'vue';
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

// Make sure labels are initialized
const unwatch = watch(sdkPlugin, ({ loaded }) => {
  if (!loaded) return;
  const app = useApp();
  app.model.args.customBlockLabel ??= '';
  app.model.args.defaultBlockLabel ??= 'Select Dataset';
  unwatch();
});
