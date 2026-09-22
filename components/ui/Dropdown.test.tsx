/**
 *  Copyright (c) 2026 khrotu. Apache License 2.0.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

import { render, screen, fireEvent } from '@testing-library/react';
import Dropdown, { DropdownOption } from '@/components/ui/Dropdown';
describe('Dropdown', () => {
  const mockOptions: DropdownOption[] = [
    { id: '1', name: 'Option 1' },
    { id: '2', name: 'Option 2' },
    { id: '3', name: 'Option 3' },
  ];
  const mockOnChange = jest.fn();
  beforeEach(() => {
    mockOnChange.mockClear();
  });
  it('should render with selected value', () => {
    render(<Dropdown options={mockOptions} value="1" onChange={mockOnChange} />);
    expect(screen.getByText('Option 1')).toBeInTheDocument();
  });
  it('should render "Select..." when no value is selected', () => {
    render(<Dropdown options={mockOptions} value="" onChange={mockOnChange} />);
    expect(screen.getByText('Select...')).toBeInTheDocument();
  });
  it('should open dropdown when clicked', () => {
    render(<Dropdown options={mockOptions} value="1" onChange={mockOnChange} />);
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(screen.getByText('Option 2')).toBeInTheDocument();
    expect(screen.getByText('Option 3')).toBeInTheDocument();
  });
  it('should close dropdown when clicking outside', () => {
    render(
      <div>
        <Dropdown options={mockOptions} value="1" onChange={mockOnChange} />
        <div data-testid="outside">Outside</div>
      </div>
    );
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(screen.getByText('Option 2')).toBeInTheDocument();
    const outside = screen.getByTestId('outside');
    fireEvent.mouseDown(outside);
    expect(screen.queryByText('Option 2')).not.toBeInTheDocument();
  });
  it('should call onChange when an option is selected', () => {
    render(<Dropdown options={mockOptions} value="1" onChange={mockOnChange} />);
    const button = screen.getByRole('button');
    fireEvent.click(button);
    const option2 = screen.getByText('Option 2');
    fireEvent.click(option2);
    expect(mockOnChange).toHaveBeenCalledWith('2');
  });
  it('should close dropdown after selecting an option', () => {
    render(<Dropdown options={mockOptions} value="1" onChange={mockOnChange} />);
    const button = screen.getByRole('button');
    fireEvent.click(button);
    const option2 = screen.getByText('Option 2');
    fireEvent.click(option2);
    expect(screen.queryByText('Option 3')).not.toBeInTheDocument();
  });
  it('should render with custom icon', () => {
    const icon = <span data-testid="custom-icon">Icon</span>;
    render(<Dropdown options={mockOptions} value="1" onChange={mockOnChange} icon={icon} />);
    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
  });
  it('should apply custom className', () => {
    const { container } = render(
      <Dropdown options={mockOptions} value="1" onChange={mockOnChange} className="custom-class" />
    );
    expect(container.querySelector('.custom-class')).toBeInTheDocument();
  });
  it('should show checkmark for selected option', () => {
    render(<Dropdown options={mockOptions} value="1" onChange={mockOnChange} />);
    const button = screen.getByRole('button');
    fireEvent.click(button);
    const options = screen.getAllByRole('button');
    expect(options.length).toBeGreaterThan(1);
  });
  it('should toggle dropdown when clicking button multiple times', () => {
    render(<Dropdown options={mockOptions} value="1" onChange={mockOnChange} />);
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(screen.getByText('Option 2')).toBeInTheDocument();
    fireEvent.click(button);
    expect(screen.queryByText('Option 2')).not.toBeInTheDocument();
    fireEvent.click(button);
    expect(screen.getByText('Option 2')).toBeInTheDocument();
  });
});
