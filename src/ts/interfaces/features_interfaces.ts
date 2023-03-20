export interface UserProps {
  id?: string;
  userName: string;
  password: string;
  roles: string[];
  active?: boolean;
}

export interface NoteProps {
  user: string;
  title: string;
  text: string;
  completed: string;
}
