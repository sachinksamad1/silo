'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PenSquare, BookType, Settings, LayoutList, Cloud } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useJournal } from '../hooks/useJournal';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function Sidebar() {
  const pathname = usePathname();
  const { dirtyCount } = useJournal();

  const links = [
    { href: '/', label: 'Timeline', icon: LayoutList },
    { href: '/new', label: 'New Entry', icon: PenSquare },
  ];

  return (
    <aside className="fixed inset-y-0 left-0 z-50 flex w-20 flex-col items-center border-r bg-card/80 py-8 backdrop-blur-xl md:w-64 md:items-start md:px-6">
      <div className="flex w-full flex-col items-center md:items-start md:px-2">
        <Link
          href="/"
          className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm md:w-full md:justify-start md:px-4"
        >
          <BookType className="h-6 w-6" />
          <span className="hidden ml-3 font-semibold tracking-tight md:inline">
            Silo Journal
          </span>
        </Link>
      </div>

      <nav className="mt-12 flex w-full flex-col gap-4 px-2 md:px-0">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'group flex h-12 w-full items-center justify-center rounded-xl transition-all md:justify-start md:px-4',
                isActive
                  ? 'bg-secondary text-secondary-foreground font-medium shadow-sm'
                  : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground'
              )}
            >
              <Icon
                className={cn('h-5 w-5', isActive ? 'text-primary' : 'opacity-70 group-hover:opacity-100')}
              />
              <span className="hidden ml-3 md:inline">{link.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto flex w-full flex-col gap-4 px-2 md:px-0">
        <div
          className={cn(
            'flex h-12 w-full items-center justify-center rounded-xl md:justify-start md:px-4',
            dirtyCount && dirtyCount > 0
              ? 'text-amber-500'
              : 'text-muted-foreground opacity-50'
          )}
          title={dirtyCount > 0 ? `${dirtyCount} entries pending sync` : 'Synced'}
        >
          <Cloud className="h-5 w-5" />
          {dirtyCount !== undefined && (
            <span className="hidden ml-3 text-sm md:inline">
              {dirtyCount > 0 ? `${dirtyCount} pending` : 'Up to date'}
            </span>
          )}
        </div>
        <button
          className="group flex h-12 w-full items-center justify-center rounded-xl text-muted-foreground transition-all hover:bg-secondary/50 hover:text-foreground md:justify-start md:px-4"
          aria-label="Settings"
        >
          <Settings className="h-5 w-5 opacity-70 group-hover:opacity-100" />
          <span className="hidden ml-3 md:inline">Settings</span>
        </button>
      </div>
    </aside>
  );
}
