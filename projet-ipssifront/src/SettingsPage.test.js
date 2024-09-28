import { render, screen, fireEvent } from '@testing-library/react';
import SettingsPage from '../pages/SettingsPage';

test('change de thème', () => {
    render(<SettingsPage />);
    fireEvent.change(screen.getByText('Choisissez votre thème :').nextSibling, { target: { value: 'dark' } });
    expect(screen.getByText('Thème actuel :')).toHaveTextContent('dark');
});
