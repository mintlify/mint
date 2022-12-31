import { useColors } from '@/hooks/useColors';

export function ColorVariables() {
  const colors = useColors();

  const cssVariables = `:root {
    --primary: ${colors.primary};
    --primary-light: ${colors.primaryLight};
    --primary-dark: ${colors.primaryDark};
    --background-light: ${colors.backgroundLight};
    --background-dark: ${colors.backgroundDark};
  }`;

  return <style>{cssVariables}</style>;
}
