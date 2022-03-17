export type CommandItemType = 'normal' | 'color' | 'font-name' | 'font-size';

export interface CommandItem {
  id: string;
  name: string;
  type?: CommandItem;
  element?: Element;
  icon?: string;
  children?: CommandItem[];
}

export class Toolbar {
  private items: CommandItem[] = [];

  setItems(items: CommandItem[]) {
    this.items = items;
  }
}