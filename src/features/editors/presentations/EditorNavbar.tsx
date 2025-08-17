import LocalAILogo from '@/assets/logo.png';
import { ModelSelector } from '@/features/model-selectors/presentations/ModelSelector';
import { Navbar, NavbarBrand, NavbarContent, NavbarItem } from '@heroui/react';
import NextImage from 'next/image';

export const EditorNavbar = () => {
  return (
    <Navbar maxWidth="full" className="bg-content1">
      <NavbarBrand>
        <NextImage src={LocalAILogo} alt="LocalAI Logo" width={32} height={32} priority />
      </NavbarBrand>
      <NavbarContent justify="center">
        <NavbarItem>
          <ModelSelector />
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end" />
    </Navbar>
  );
};
