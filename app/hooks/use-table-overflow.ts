"use client";

import { useEffect, useRef, useState } from "react";
import {
  CARD_HARD_MAX_WIDTH,
  CARD_SOFT_MAX_WIDTH,
  MAX_CARD_HEIGHT,
  TABLE_CLIP_VISIBLE_RATIO,
  TABLE_SOFT_COLUMN_COUNT,
} from "../lib/constants";
import type { TableData } from "../lib/types";

// duas fontes independentes de "ficou grande demais": (1) alguma célula
// mostrando menos que TABLE_CLIP_VISIBLE_RATIO do próprio conteúdo — sinal
// direto de dado ilegível, não depende de como a tabela resolveu o layout;
// (2) a tabela (já com larguras definidas, seja por resize manual ou pelo
// ajuste automático) ficou fisicamente maior que o card permite — nesse
// caso o texto não corta, mas colunas inteiras somem da imagem exportada
export function useTableOverflow(table: TableData) {
  const ref = useRef<HTMLDivElement>(null);
  const [isOverflowingWidth, setIsOverflowingWidth] = useState(false);
  const [isOverflowingWidthHard, setIsOverflowingWidthHard] = useState(false);
  const [isOverflowingHeight, setIsOverflowingHeight] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const check = () => {
      const inputs = Array.from(el.querySelectorAll("th input, td input")) as HTMLInputElement[];
      const visibleRatios = inputs
        .filter((input) => input.value !== "" && input.scrollWidth > 0)
        .map((input) => input.clientWidth / input.scrollWidth);
      const worstRatio = visibleRatios.length ? Math.min(...visibleRatios) : 1;

      const hasSevereClipping = worstRatio < TABLE_CLIP_VISIBLE_RATIO;
      const hasMildClipping = worstRatio < 1;
      const exceedsCardWidth = el.scrollWidth >= CARD_HARD_MAX_WIDTH;
      const approachesCardWidth = el.scrollWidth >= CARD_SOFT_MAX_WIDTH;

      setIsOverflowingWidth(
        hasMildClipping || approachesCardWidth || table.headers.length > TABLE_SOFT_COLUMN_COUNT,
      );
      setIsOverflowingWidthHard(hasSevereClipping || exceedsCardWidth);
      setIsOverflowingHeight(el.scrollHeight > MAX_CARD_HEIGHT);
    };

    check();
    const observer = new ResizeObserver(check);
    observer.observe(el);
    return () => observer.disconnect();
  }, [table]);

  return { ref, isOverflowingWidth, isOverflowingWidthHard, isOverflowingHeight };
}
