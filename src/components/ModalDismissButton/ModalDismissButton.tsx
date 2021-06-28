import { FC, HTMLAttributes } from 'react';
import { Icon20Cancel } from '@vkontakte/icons';
import Tappable from '../Tappable/Tappable';
import { getClassName } from '../../helpers/getClassName';
import { usePlatform } from '../../hooks/usePlatform';

export type ModalDismissButtonProps = HTMLAttributes<HTMLButtonElement> & {
  'aria-label'?: string;
  isMobile?: boolean;
};

const ModalDismissButton: FC<ModalDismissButtonProps> = ({ isMobile, ...props }: ModalDismissButtonProps) => {
  const platform = usePlatform();
  return (
    <Tappable
      vkuiClass={
        [getClassName('ModalDismissButton', platform),
          isMobile ? 'ModalDismissButton--mobile' : 'ModalDismissButton--desktop']}
      {...props}
      activeMode="ModalDismissButton--active"
      hoverMode="ModalDismissButton--hover"
    >
      <Icon20Cancel />
    </Tappable>
  );
};

ModalDismissButton.defaultProps = {
  'aria-label': 'Закрыть',
};

export default ModalDismissButton;
