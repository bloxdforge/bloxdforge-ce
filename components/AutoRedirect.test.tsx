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

import { render } from '@testing-library/react';
import { AutoRedirect } from '@/components/AutoRedirect';
import { useSettingsStore } from '@/stores/useSettingsStore';
import { useRouter, usePathname } from 'next/navigation';
jest.mock('@/stores/useSettingsStore');
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(),
}));
describe('AutoRedirect', () => {
  const mockReplace = jest.fn();
  const mockUseSettingsStore = useSettingsStore as jest.MockedFunction<typeof useSettingsStore>;
  const mockUseRouter = useRouter as jest.Mock;
  const mockUsePathname = usePathname as jest.Mock;
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseRouter.mockReturnValue({
      replace: mockReplace,
    });
  });
  it('should redirect to /studio when autoRedirectToStudio is enabled and on home page', () => {
    mockUseSettingsStore.mockReturnValue({
      autoRedirectToStudio: true,
    } as ReturnType<typeof useSettingsStore>);
    mockUsePathname.mockReturnValue('/');
    render(<AutoRedirect />);
    expect(mockReplace).toHaveBeenCalledWith('/studio');
  });
  it('should not redirect when autoRedirectToStudio is disabled', () => {
    mockUseSettingsStore.mockReturnValue({
      autoRedirectToStudio: false,
    } as ReturnType<typeof useSettingsStore>);
    mockUsePathname.mockReturnValue('/');
    render(<AutoRedirect />);
    expect(mockReplace).not.toHaveBeenCalled();
  });
  it('should not redirect when not on home page', () => {
    mockUseSettingsStore.mockReturnValue({
      autoRedirectToStudio: true,
    } as ReturnType<typeof useSettingsStore>);
    mockUsePathname.mockReturnValue('/studio');
    render(<AutoRedirect />);
    expect(mockReplace).not.toHaveBeenCalled();
  });
  it('should not redirect when on a different page', () => {
    mockUseSettingsStore.mockReturnValue({
      autoRedirectToStudio: true,
    } as ReturnType<typeof useSettingsStore>);
    mockUsePathname.mockReturnValue('/workshop');
    render(<AutoRedirect />);
    expect(mockReplace).not.toHaveBeenCalled();
  });
  it('should render nothing (null)', () => {
    mockUseSettingsStore.mockReturnValue({
      autoRedirectToStudio: false,
    } as ReturnType<typeof useSettingsStore>);
    mockUsePathname.mockReturnValue('/');
    const { container } = render(<AutoRedirect />);
    expect(container.firstChild).toBeNull();
  });
  it('should react to changes in autoRedirectToStudio', () => {
    mockUsePathname.mockReturnValue('/');
    mockUseSettingsStore.mockReturnValue({
      autoRedirectToStudio: false,
    } as ReturnType<typeof useSettingsStore>);
    const { rerender } = render(<AutoRedirect />);
    expect(mockReplace).not.toHaveBeenCalled();
    mockUseSettingsStore.mockReturnValue({
      autoRedirectToStudio: true,
    } as ReturnType<typeof useSettingsStore>);
    rerender(<AutoRedirect />);
    expect(mockReplace).toHaveBeenCalledWith('/studio');
  });
});
