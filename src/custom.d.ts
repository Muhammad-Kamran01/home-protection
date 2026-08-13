declare module '*.png' {
  const src: string;
  export default src;
}

declare module '*.svg' {
  const src: string;
  export default src;
}

// Allow importing html2canvas and jspdf when types are not installed
declare module 'html2canvas' {
  export default function html2canvas(element: HTMLElement, options?: any): Promise<HTMLCanvasElement>;
}

declare module 'jspdf' {
  export const jsPDF: any;
  export default jsPDF;
}
