declare module '@barba/core' {
  export interface ITransitionData {
    current: {
      container: HTMLElement;
      namespace?: string;
    };
    next: {
      container: HTMLElement;
      namespace?: string;
    };
  }

  export interface ITransition {
    name?: string;
    from?: string;
    to?: string;
    leave?: (data: ITransitionData) => Promise<unknown> | unknown;
    enter?: (data: ITransitionData) => Promise<unknown> | unknown;
  }

  export interface BarbaInitOptions {
    preventRunning?: boolean;
    transitions?: ITransition[];
  }

  interface Barba {
    init(options: BarbaInitOptions): void;
  }

  const barba: Barba;
  export default barba;
}
