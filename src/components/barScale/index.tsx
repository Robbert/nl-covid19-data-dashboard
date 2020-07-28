import styles from './styles.module.scss';
import { useRef, FunctionComponent } from 'react';
import formatNumber from 'utils/formatNumber';
import ScreenReaderOnly from 'components/screenReaderOnly';
import replaceVariablesInText from 'utils/replaceVariablesInText';
import { scaleLinear, scaleQuantile, scaleThreshold } from 'd3-scale';

type GradientStop = {
  color: string;
  value: number;
};

type BarscaleProps = {
  min: number;
  max: number;
  value: number | null | undefined;
  kritiekeWaarde?: number;
  gradient: GradientStop[];
  id: string;
  screenReaderText: string;
};

/**
 * Use this hook to get an x-scale for your barcharts
 * You use this by providing a desired min and max for your domains
 * We compare the extent of your domain with your data value, and use the data value as the max value
 * for your scale when it's higher than the imperative max value. This ensures you can set your min/max values
 * imperatively with the guarantee the scale won't break if suddenly the value is higher than your
 * desires min/max extent.
 */
function useDynamicScale(min: number, max: number, value?: number | null) {
  let scaleMax = max;

  const isValueHigherThanMax = value && value !== null && value > max;
  if (value) {
    if (isValueHigherThanMax) {
      scaleMax = value;
    }
  }

  const scale = scaleLinear().domain([min, scaleMax]).range([0, 100]);

  if (isValueHigherThanMax) {
    scale.nice(2);
  }

  return scale;
}

const BarScale: FunctionComponent<BarscaleProps> = ({
  min,
  max,
  value,
  kritiekeWaarde,
  gradient,
  id,
  screenReaderText,
}) => {
  // Generate a random ID used for clipPath and linearGradient ID's.
  const rand = useRef(Math.random().toString(36).substring(2, 15));

  const x = useDynamicScale(min, max, value);
  const [xMin, xMax] = x.domain();

  if (typeof value === 'undefined' || value === null) {
    return null;
  }

  const textAlign = scaleThreshold()
    .domain([20, 80])
    .range(['start', 'middle', 'end'] as any);

  const color = scaleQuantile()
    .domain(gradient.map((el) => el.value))
    .range(gradient.map((el) => el.color) as any);

  return (
    <>
      <ScreenReaderOnly>
        {replaceVariablesInText(screenReaderText, {
          value: String(value),
          kritiekeWaarde: String(kritiekeWaarde),
        })}
      </ScreenReaderOnly>

      <div className={styles.root} aria-hidden="true">
        <svg xmlns="http://www.w3.org/2000/svg">
          <defs>
            <clipPath id={`cut-off${id}-${rand.current}`}>
              <rect
                x="0"
                y={36}
                rx="2"
                ry="2"
                width={`${x(value)}%`}
                height="10"
                fill="black"
              />
            </clipPath>
            <linearGradient
              id={`barColor${id}-${rand.current}`}
              gradientUnits="userSpaceOnUse"
            >
              {color.domain().map((value: any) => (
                <stop
                  key={`stop-${value}`}
                  stopColor={color(value) as any}
                  offset={`${x(value)}%`}
                />
              ))}
            </linearGradient>
          </defs>

          <g>
            <rect
              x="0"
              y={36}
              rx="2"
              ry="2"
              width="100%"
              height="10"
              clipPath={`url(#cut-off${id}-${rand.current})`}
              fill={`url(#barColor${id}-${rand.current})`}
            />
            <rect
              x="0"
              y={42}
              rx="2"
              ry="2"
              width="100%"
              height="4"
              fill={`url(#barColor${id}-${rand.current})`}
            />
          </g>

          <g>
            <line
              x1={`${x(value)}%`}
              x2={`${x(value)}%`}
              y1={46}
              y2={26}
              strokeWidth="3"
              stroke="#000"
            />

            <text
              className={styles.value}
              x={`${x(value)}%`}
              y={16}
              textAnchor={textAlign(x(value)) as any}
            >{`${formatNumber(value)}`}</text>
          </g>

          {kritiekeWaarde && (
            <g>
              <line
                x1={`${x(kritiekeWaarde)}%`}
                x2={`${x(kritiekeWaarde)}%`}
                y1={56}
                y2={46}
                strokeWidth="3"
                stroke="#595959"
              />
              <text
                className={styles.criticalValue}
                x={`${x(kritiekeWaarde)}%`}
                y={72}
                textAnchor={textAlign(x(kritiekeWaarde)) as any}
              >{`Signaalwaarde: ${kritiekeWaarde}`}</text>
            </g>
          )}

          <g>
            <text x={`${x(xMin)}%`} y={64} className={styles.tick}>
              {xMin}
            </text>
            <text
              x={`${x(xMax)}%`}
              y={64}
              className={styles.tick}
              textAnchor="end"
            >
              {xMax}
            </text>
          </g>
        </svg>
      </div>
    </>
  );
};

export default BarScale;
