import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './button';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  args: {
    children: 'Place order'
  }
};

export default meta;

type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: { intent: 'primary' }
};

export const Secondary: Story = {
  args: { intent: 'secondary' }
};

export const Ghost: Story = {
  args: { intent: 'ghost' }
};
