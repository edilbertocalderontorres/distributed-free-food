import pluginVue from "eslint-plugin-vue";
import { defineConfigWithVueTs, vueTsConfigs } from "@vue/eslint-config-typescript";
import skipFormatting from "@vue/eslint-config-prettier/skip-formatting";

// Configurar ESLint para que reconozca <script setup>
export default defineConfigWithVueTs(
  {
    name: "app/files-to-lint",
    files: ["**/*.{ts,mts,tsx,vue}"],
  },

  {
    name: "app/files-to-ignore",
    ignores: ["**/dist/**", "**/dist-ssr/**", "**/coverage/**"],
  },

  pluginVue.configs["flat/recommended"], // Se recomienda usar "flat/recommended"
  vueTsConfigs.recommended,
  skipFormatting,

  {
    name: "app/custom-rules",
    rules: {
      "vue/multi-word-component-names": "off", // Permite nombres de un solo palabra en componentes
      "vue/script-setup-uses-vars": "error",  // Evita falsos errores en <script setup>
      "vue/define-macros-order": [
        "error",
        {
          order: ["defineOptions", "defineProps", "defineEmits", "defineSlots"],
        },
      ],
    },
  }
);
