import { ref } from "vue";

export const getPicWidth = (picNum: number | undefined) => {
  const picWidth = ref(610);

  if (picNum === 1) {
    picWidth.value = 610;
  } else if (picNum === 2 || picNum === 4) {
    picWidth.value = 298;
  } else {
    picWidth.value = 192;
  }
  return {
    picWidth,
  };
};
