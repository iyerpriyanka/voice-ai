import {
  useState,
  useContext,
  useMemo,
  type FC,
  type HTMLAttributes,
} from 'react';
import { ProjectRole } from '@rapidaai/react';
import { cn } from '@/utils';
import { useLocation } from 'react-router-dom';
import { CustomLink } from '@/app/components/ui/primitives';
import { AuthContext } from '@/context/auth-context';
import { Moon, Sun, UserAvatar } from '@carbon/icons-react';
import {
  HeaderGlobalAction,
  HeaderGlobalBar,
  HeaderPanel,
  Switcher,
  SwitcherItem,
} from '@carbon/react';
import { Breadcrumb } from '@/app/components/ui/primitives';
import { Dropdown } from '@/app/components/ui/primitives';
import { useRapidaStore } from '@/hooks';
import { useTheme } from '@/theme/theme-provider';

export function ActionableHeader({
  className,
  ...attributes
}: HTMLAttributes<HTMLElement>) {
  const location = useLocation();
  const { pathname } = location;
  const { loading, loadingType } = useRapidaStore();
  const isLoading = loading && loadingType === 'block';

  const breadcrumbs = useMemo(() => {
    const pathParts = pathname.split('/').filter(part => part?.trim() !== '');
    return pathParts.map((part, partIndex) => {
      const previousParts = pathParts.slice(0, partIndex);
      return {
        label: part,
        href:
          previousParts?.length > 0
            ? `/${previousParts?.join('/')}/${part}`
            : `/${part}`,
      };
    });
  }, [pathname]);

  return (
    <header
      {...attributes}
      className={cn(
        'h-12 flex items-center justify-between',
        'bg-shell text-foreground',
        'border-b border-border-subtle',
        'shrink-0',
        className,
      )}
    >
      <Breadcrumb
        isLoading={isLoading}
        className="pl-4"
        items={breadcrumbs.map(x => ({
          label: x.label,
          render: () => (
            <CustomLink className="capitalize" to={x.href}>
              {x.label}
            </CustomLink>
          ),
        }))}
      />
      <CustomerOptions isLoading={isLoading} />
    </header>
  );
}

export const CustomerOptions: FC<{
  isLoading?: boolean;
  showProjectSelector?: boolean;
}> = ({ isLoading, showProjectSelector = true }) => {
  const { projectRoles, currentProjectRole, setCurrentProjectRole } =
    useContext(AuthContext);

  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);
  const { resolvedMode, theme, toggleMode } = useTheme();
  const isDarkMode = resolvedMode === 'dark';

  return (
    <HeaderGlobalBar>
      {showProjectSelector && projectRoles && setCurrentProjectRole && (
        <Dropdown
          id="project-selector"
          titleText=""
          hideLabel
          label="Select a Project"
          size="sm"
          direction="bottom"
          items={projectRoles}
          selectedItem={currentProjectRole}
          itemToString={(item: ProjectRole.AsObject | null) =>
            item?.projectname || ''
          }
          onChange={({ selectedItem }) => {
            if (selectedItem) setCurrentProjectRole(selectedItem);
          }}
          className="project-selector-dropdown"
          isLoading={isLoading}
        />
      )}

      {theme.allowModeSelection && (
        <HeaderGlobalAction
          aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
          onClick={toggleMode}
          tooltipAlignment="end"
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </HeaderGlobalAction>
      )}

      <HeaderGlobalAction
        aria-label="Account"
        isActive={accountDropdownOpen}
        onClick={() => setAccountDropdownOpen(!accountDropdownOpen)}
        tooltipAlignment="end"
      >
        <UserAvatar size={20} />
      </HeaderGlobalAction>

      <HeaderPanel expanded={accountDropdownOpen}>
        <Switcher
          aria-label={`${theme.brand.name} account`}
          expanded={accountDropdownOpen}
        >
          <li className="cds--switcher__item--divider">
            <span className="uppercase!">Account</span>
          </li>
          <SwitcherItem aria-label="Account Settings" href="/account">
            Account Settings
          </SwitcherItem>
          <li className="cds--switcher__item--divider">
            <span className="uppercase!">Resources</span>
          </li>
          <SwitcherItem aria-label="Support" href={theme.links.support}>
            Support
          </SwitcherItem>
          <SwitcherItem aria-label="Terms" href={theme.links.terms}>
            Terms
          </SwitcherItem>
          <SwitcherItem aria-label="Privacy" href={theme.links.privacy}>
            Privacy
          </SwitcherItem>
          <li className="cds--switcher__item--divider">
            <span className="uppercase!">Session</span>
          </li>
          <SwitcherItem aria-label="Sign out" href="/auth/signin">
            Sign out
          </SwitcherItem>
        </Switcher>
      </HeaderPanel>
    </HeaderGlobalBar>
  );
};
