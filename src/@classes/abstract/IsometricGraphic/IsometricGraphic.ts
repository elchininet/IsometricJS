import { Colors, LineCap, LineJoin, StrokeLinecap, StrokeLinejoin, Listener } from '@types';
import { SVG_NAMESPACE, SVG_ELEMENTS } from '@constants';
import { IsometricStore } from '@classes/abstract/IsometricStore';
import { addSVGProperties, addEventListenerToElement, removeEventListenerFromElement } from '@utils';
import { IsometricGraphicProps } from './types';

const defaultGraphicProps: IsometricGraphicProps = {
    fillColor: Colors.white,
    fillOpacity: 1,
    strokeColor: Colors.black,
    strokeDashArray: [],
    strokeLinecap: LineCap.butt,
    strokeLinejoin: LineJoin.round,
    strokeOpacity: 1,
    strokeWidth: 1
};

export abstract class IsometricGraphic extends IsometricStore {

    public constructor(props: IsometricGraphicProps) {

        super();

        this.props = {...defaultGraphicProps, ...props};
        this.path = document.createElementNS(SVG_NAMESPACE, SVG_ELEMENTS.path);
        this.listeners = [];
        
        addSVGProperties(this.path, {
            'fill': this.fillColor,
            'fill-opacity': `${this.fillOpacity}`,
            'stroke': this.strokeColor,
            'stroke-dasharray': this.strokeDashArray.join(' '),
            'stroke-linecap': this.strokeLinecap,
            'stroke-linejoin': this.strokeLinejoin,
            'stroke-opacity': `${this.strokeOpacity}`,
            'stroke-width': `${this.strokeWidth}`
        });

    }

    protected props: IsometricGraphicProps;    
    protected path: SVGPathElement;
    protected listeners: Listener[];

    abstract update(): IsometricGraphic;
    abstract clear(): IsometricGraphic;

    public getElement(): SVGPathElement {
        return this.path;
    }

    // fillColor
    public get fillColor(): string {
        return this.props.fillColor;
    }

    public set fillColor(value: string) {
        this.props.fillColor = value;
        addSVGProperties(this.path, { 'fill': this.fillColor });
    }

    // fillOpacity
    public get fillOpacity(): number {
        return this.props.fillOpacity;
    }

    public set fillOpacity(value: number) {
        this.props.fillOpacity = value;
        addSVGProperties(this.path, { 'fill-opacity': `${this.fillOpacity}` });
    }

    // strokeColor
    public get strokeColor(): string {
        return this.props.strokeColor;
    }

    public set strokeColor(value: string) {
        this.props.strokeColor = value;
        addSVGProperties(this.path, { 'stroke': this.strokeColor });
    }

    // strokeDashArray
    public get strokeDashArray(): number[] {
        return this.props.strokeDashArray;
    }

    public set strokeDashArray(value: number[]) {
        this.props.strokeDashArray = value;
        addSVGProperties(this.path, { 'stroke-dasharray': this.strokeDashArray.join(' ') });
    }

    // strokeLinecap
    public get strokeLinecap(): StrokeLinecap {
        return this.props.strokeLinecap;
    }

    public set strokeLinecap(value: StrokeLinecap) {
        this.props.strokeLinecap = LineCap[value];
        addSVGProperties(this.path, { 'stroke-linecap': this.strokeLinecap });
    }

    // strokeLinejoin
    public get strokeLinejoin(): StrokeLinejoin {
        return this.props.strokeLinejoin;
    }

    public set strokeLinejoin(value: StrokeLinejoin) {
        this.props.strokeLinejoin = LineJoin[value];
        addSVGProperties(this.path, { 'stroke-linejoin': this.strokeLinejoin });
    }

    // strokeOpacity
    public get strokeOpacity(): number {
        return this.props.strokeOpacity;
    }

    public set strokeOpacity(value: number) {
        this.props.strokeOpacity = value;
        addSVGProperties(this.path, { 'stroke-opacity': `${this.strokeOpacity}` });
    }

    // strokeWidth
    public get strokeWidth(): number {
        return this.props.strokeWidth;
    }

    public set strokeWidth(value: number) {
        this.props.strokeWidth = value;
        addSVGProperties(this.path, { 'stroke-width': `${this.strokeWidth}` });
    }

    public addEventListener(event: string, callback: VoidFunction, useCapture = false): IsometricGraphic {
        addEventListenerToElement.call(this, this.path, this.listeners, event, callback, useCapture);
        return this;
    }

    public removeEventListener(event: string, callback: VoidFunction, useCapture = false): IsometricGraphic {
        removeEventListenerFromElement(this.path, this.listeners, event, callback, useCapture);
        return this;
    }

}