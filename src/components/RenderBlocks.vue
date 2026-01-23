<template>
  <span class="blocks" :class="[modeClass, contextClass]">
    <template v-for="(b, i) in safeBlocks" :key="i">
      <span
        v-if="b.type === 'text' || b.type === 'math'"
        class="b-text"
        v-math
        v-text="b.value"></span>

      <img
        v-else-if="b.type === 'image'"
        class="b-img rounded"
        :class="imgClass"
        :style="imgStyle"
        :src="normalizeSrc(b.value)"
        alt=""
        loading="lazy" />
    </template>
  </span>
</template>

<script>
import renderMathInElement from "katex/contrib/auto-render";

export default {
  name: "RenderBlocks",
  props: {
    blocks: { type: Array, default: () => [] },
    baseUrl: { type: String, default: "" },
    mode: { type: String, default: "inline" },
    imgClass: { type: String, default: "" },
    imgStyle: { type: String, default: "" },
    context: { type: String, default: "question" },
  },
  computed: {
    safeBlocks() {
      return Array.isArray(this.blocks) ? this.blocks.filter(Boolean) : [];
    },
    modeClass() {
      return this.mode === "block" ? "mode-block" : "mode-inline";
    },
    contextClass() {
      return this.context === "option" ? "ctx-option" : "ctx-question";
    },
  },
  directives: {
    math: {
      mounted(el) {
        renderMathInElement(el, {
          delimiters: [
            { left: "$$", right: "$$", display: true },
            { left: "\\[", right: "\\]", display: true },
            { left: "$", right: "$", display: false },
            { left: "\\(", right: "\\)", display: false },
          ],
          throwOnError: false,
        });
      },
      updated(el) {
        renderMathInElement(el, {
          delimiters: [
            { left: "$$", right: "$$", display: true },
            { left: "\\[", right: "\\]", display: true },
            { left: "$", right: "$", display: false },
            { left: "\\(", right: "\\)", display: false },
          ],
          throwOnError: false,
        });
      },
    },
  },
  methods: {
    normalizeSrc(src) {
      if (!src) return "";
      if (src.startsWith("http")) return src;
      if (!this.baseUrl) return src;
      const b = this.baseUrl.replace(/\/$/, "");
      const s = src.startsWith("/") ? src : "/" + src;
      return b + s;
    },
  },
};
</script>

<style scoped>
.blocks {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  flex-wrap: wrap;
}

.b-text {
  white-space: pre-wrap;
}

.b-img {
  height: auto;
  flex: 0 0 auto;
}

.mode-inline .img-q {
  height: 35px;
}

.mode-inline .img-opt {
  height: 25px;
}

.mode-block .b-img {
  height: 50px;
}
</style>
