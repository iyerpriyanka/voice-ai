import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

import { RightSideModal } from './right-side-modal';

const mockAnimate = jest.fn(() => Promise.resolve());
const mockDragStart = jest.fn();
const mockMotionValueGet = jest.fn(() => 0);

jest.mock('react-use-measure', () => ({
  __esModule: true,
  default: () => [jest.fn(), { width: 320 }],
}));

jest.mock('framer-motion', () => {
  const React = require('react');

  const MotionDiv = React.forwardRef(
    (
      {
        children,
        initial,
        animate,
        transition,
        drag,
        dragControls,
        dragListener,
        dragConstraints,
        dragElastic,
        style,
        ...props
      }: any,
      ref: any,
    ) => (
      <div ref={ref} {...props}>
        {children}
      </div>
    ),
  );
  MotionDiv.displayName = 'MotionDiv';

  return {
    motion: {
      div: MotionDiv,
    },
    useAnimate: () => [
      {
        current: null,
      },
      mockAnimate,
    ],
    useDragControls: () => ({
      start: mockDragStart,
    }),
    useMotionValue: () => ({
      get: mockMotionValueGet,
    }),
  };
});

jest.mock('@/app/components/ui/modal', () => ({
  ModalHeader: ({ label, title, onClose }: any) => (
    <header>
      <span>{label}</span>
      <h2>{title}</h2>
      <button type="button" onClick={onClose}>
        Header close
      </button>
    </header>
  ),
}));

jest.mock('@/app/components/ui/button', () => ({
  IconOnlyButton: ({ iconDescription, kind, renderIcon: Icon, ...props }: any) => (
    <button
      type="button"
      aria-label={iconDescription}
      data-carbon-icon-button-kind={kind}
      {...props}
    >
      {Icon ? <Icon /> : null}
    </button>
  ),
}));

jest.mock('@carbon/icons-react', () => ({
  Close: () => <svg data-testid="close-icon" />,
}));

describe('RightSideModal', () => {
  beforeEach(() => {
    mockAnimate.mockClear();
    mockDragStart.mockClear();
    mockMotionValueGet.mockClear();
  });

  it('does not render drawer content when closed', () => {
    render(
      <RightSideModal modalOpen={false} setModalOpen={jest.fn()}>
        Drawer content
      </RightSideModal>,
    );

    expect(screen.queryByText('Drawer content')).not.toBeInTheDocument();
  });

  it('closes no-title drawers from the Carbon icon action', async () => {
    const setModalOpen = jest.fn();

    render(
      <RightSideModal modalOpen setModalOpen={setModalOpen}>
        Drawer content
      </RightSideModal>,
    );

    const closeButton = screen.getByRole('button', { name: 'Close' });
    expect(closeButton).toHaveAttribute('data-carbon-icon-button-kind', 'ghost');
    expect(screen.getByTestId('close-icon')).toBeInTheDocument();

    fireEvent.click(closeButton);

    await waitFor(() => expect(setModalOpen).toHaveBeenCalledWith(false));
  });

  it('starts drawer dragging from the resize handle', () => {
    render(
      <RightSideModal modalOpen setModalOpen={jest.fn()}>
        Drawer content
      </RightSideModal>,
    );

    fireEvent.pointerDown(screen.getByRole('button', { name: 'Resize drawer' }));

    expect(mockDragStart).toHaveBeenCalledTimes(1);
  });
});
