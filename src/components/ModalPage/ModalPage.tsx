import { FC, HTMLAttributes, ReactNode, useContext, useEffect } from 'react';
import { getClassName } from '../../helpers/getClassName';
import { classNames } from '../../lib/classNames';
import { ModalRootContext, useModalRegistry } from '../ModalRoot/ModalRootContext';
import { usePlatform } from '../../hooks/usePlatform';
import { withAdaptivity, AdaptivityProps, ViewHeight, ViewWidth } from '../../hoc/withAdaptivity';
import ModalDismissButton from '../ModalDismissButton/ModalDismissButton';
import { Ref } from '../../types';
import { multiRef } from '../../lib/utils';
import { ModalType } from '../ModalRoot/types';
import { getNavId, NavIdProps } from '../../lib/getNavId';
import { warnOnce } from '../../lib/warnOnce';

export interface ModalPageProps extends HTMLAttributes<HTMLDivElement>, AdaptivityProps, NavIdProps {
  /**
   * Шапка модальной страницы, `<ModalPageHeader />`
   */
  header?: ReactNode;
  onClose?: VoidFunction;
  /**
   * Процент, на который изначально будет открыта модальная страница. При `settlingHeight={100}` модальная страница раскрывается на всю высоту.
   */
  settlingHeight?: number;
  /**
   * Если высота контента в модальной странице может поменяться, нужно установить это свойство
   */
  dynamicContentHeight?: boolean;
  getModalContentRef?: Ref<HTMLDivElement>;

  /**
   * Показывать ли кнопку Закрыть на десктопе и мобильном устройстве
   */
  showCloseButton?: boolean;
}

const warn = warnOnce('ModalPage');
const ModalPage: FC<ModalPageProps> = (props: ModalPageProps) => {
  const platform = usePlatform();
  const { updateModalHeight } = useContext(ModalRootContext);
  const {
    children,
    header,
    viewWidth,
    viewHeight,
    sizeX,
    hasMouse,
    onClose,
    settlingHeight,
    dynamicContentHeight,
    getModalContentRef,
    nav,
    showCloseButton,
    ...restProps
  } = props;

  useEffect(() => {
    updateModalHeight();
  }, [children]);

  const isDesktop = viewWidth >= ViewWidth.SMALL_TABLET && (hasMouse || viewHeight >= ViewHeight.MEDIUM);

  const modalContext = useContext(ModalRootContext);
  const { refs } = useModalRegistry(getNavId(props, warn), ModalType.PAGE);

  return (
    <div
      {...restProps}
      vkuiClass={classNames(getClassName('ModalPage', platform), `ModalPage--sizeX-${sizeX}`, {
        'ModalPage--desktop': isDesktop,
      })}
    >
      <div vkuiClass="ModalPage__in-wrap" ref={refs.innerElement}>
        {showCloseButton && !isDesktop &&
          <ModalDismissButton
            isMobile={!isDesktop}
            onClick={onClose || modalContext.onClose} />}

        <div vkuiClass="ModalPage__in">
          <div vkuiClass="ModalPage__header" ref={refs.headerElement}>
            {header}
          </div>

          <div vkuiClass="ModalPage__content-wrap">
            <div vkuiClass="ModalPage__content" ref={multiRef<HTMLDivElement>(refs.contentElement, getModalContentRef)}>
              <div vkuiClass="ModalPage__content-in">
                {children}
              </div>
            </div>
          </div>

          {showCloseButton && isDesktop &&
            <ModalDismissButton
              isMobile={!isDesktop}
              onClick={onClose || modalContext.onClose} />}
        </div>
      </div>
    </div>
  );
};

ModalPage.defaultProps = {
  settlingHeight: 75,
  showCloseButton: true,
};

export default withAdaptivity(ModalPage, {
  viewWidth: true,
  viewHeight: true,
  sizeX: true,
  hasMouse: true,
});
