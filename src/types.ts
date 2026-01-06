export type FormElement = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;

export type MinimalChangeEvent = {
  target: {
    name: string;
    value: string | boolean;
    type?: string;
    checked?: boolean;
  };
};
