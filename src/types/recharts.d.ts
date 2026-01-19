import 'recharts';

declare module 'recharts' {
    export interface PieLabelRenderProps {
        name: string;
        percent?: number;
        value?: number;
        payload?: any;
    }
}
