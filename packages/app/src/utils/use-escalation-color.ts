import { useMemo } from 'react';
import { thresholds } from '~/components/choropleth/logic/thresholds';
import { EscalationLevel } from '~/domain/restrictions/types';
import { colors } from '~/style/theme';
import { assert } from './assert';

export function useEscalationColor(level: EscalationLevel) {
  return useMemo(() => {
    /**
     * return early if no level is known
     */
    if (level === null) {
      return colors.data.neutral;
    }

    const escalationThresholds = thresholds.vr.level;

    const escalationColor = escalationThresholds.find(
      (threshold) => threshold.threshold === level
    )?.color;

    assert(
      escalationColor,
      `Cannot resolve an escalation color for level '${level}'`
    );

    return escalationColor;
  }, [level]);
}
