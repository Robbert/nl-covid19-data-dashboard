import { DifferenceDecimal, DifferenceInteger } from '@corona-dashboard/common';
import { ReactComponent as IconGelijk } from '~/assets/gelijk.svg';
import { ReactComponent as IconUp } from '~/assets/pijl-omhoog.svg';
import { ReactComponent as IconDown } from '~/assets/pijl-omlaag.svg';
import { Container, IconContainer } from './containers';

export function SidebarDifference({
  value,
}: {
  value: DifferenceDecimal | DifferenceInteger;
}) {
  const { difference } = value;

  if (difference > 0) {
    return (
      <Container>
        <IconContainer color="red">
          <IconUp />
        </IconContainer>
      </Container>
    );
  }

  if (difference < 0) {
    return (
      <Container>
        <IconContainer color="data.primary">
          <IconDown />
        </IconContainer>
      </Container>
    );
  }

  return (
    <Container>
      <IconContainer color="data.neutral">
        <IconGelijk />
      </IconContainer>
    </Container>
  );
}
