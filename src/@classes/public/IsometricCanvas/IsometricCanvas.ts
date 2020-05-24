import { SVG_NAMESPACE, SVG_ELEMENTS, SVG_PROPERTIES, DEFAULT_WIDTH, DEFAULT_HEIGHT } from '@constants';
import { IsometricStore } from '@classes/abstract/IsometricStore';
import { Colors, Listener } from '@types';
import { Graphic } from '@classes/abstract/Graphic';
import { IsometricCanvasProps } from './types';
import { addSVGProperties, addEventListenerToElement, removeEventListenerFromElement } from '@utils';
import { Store } from '@store';

const defaultProps: IsometricCanvasProps = {
    backgroundColor: Colors.white,
    scale: 1,
    height: DEFAULT_HEIGHT,
    width: DEFAULT_WIDTH
};

export class IsometricCanvas extends IsometricStore {

    public constructor(container: HTMLElement, props: IsometricCanvasProps = {}) {
        super();
        this.props = { ...defaultProps, ...props };
        this.children = [];
        this.svg = document.createElementNS(SVG_NAMESPACE, SVG_ELEMENTS.svg);
        this.listeners = [];

        this.dataStore = new Store(
            this.props.width,
            this.props.height,
            this.props.scale
        );

        addSVGProperties(this.svg, {
            [SVG_PROPERTIES.viewBox]: `0 0 ${this.data.width} ${this.data.height}`,
            width: `${this.data.width}px`,
            height: `${this.data.height}px`
        });

        this.background = document.createElementNS(SVG_NAMESPACE, SVG_ELEMENTS.rect);

        addSVGProperties(this.background, {
            fill: this.backgroundColor,
            x: '0',
            y: '0',
            width: `${this.data.width}px`,
            height: `${this.data.height}px`
        });

        this.svg.appendChild(this.background);
        container.appendChild(this.svg);

    }
    
    private props: IsometricCanvasProps;
    private children: Graphic[];
    private svg: SVGElement;
    private background: SVGRectElement;
    private listeners: Listener[];

    private removeSVGChild(child: Graphic): void {
        const svgChild = child.getElement();
        if (svgChild.parentNode) {
            this.svg.removeChild(svgChild);
        }
    }

    private updateChildren(): void {
        this.children.forEach((child: Graphic): void => {
            child.update();
        });
    }

    public getElement(): SVGElement {
        return this.svg;
    }

    public get backgroundColor(): string {
        return this.props.backgroundColor;
    }

    public set backgroundColor(value: string) {
        this.props.backgroundColor = value;
        addSVGProperties(this.background, { fill: this.backgroundColor });
    }

    public get scale(): number {
        return this.data.scale;
    }

    public set scale(value: number) {
        this.data.scale = value;
        this.updateChildren();
    }

    public get height(): number {
        return this.data.height;
    }

    public set height(value: number) {
        this.data.height = value;
        addSVGProperties(this.svg, {
            [SVG_PROPERTIES.viewBox]: `0 0 ${this.data.width} ${this.data.height}`,
            height: `${this.data.height}px`
        });
        addSVGProperties(this.background, {
            height: `${this.data.height}px`
        });
        this.updateChildren();
    }

    public get width(): number {
        return this.data.width;
    }

    public set width(value: number) {
        this.data.width = value;
        addSVGProperties(this.svg, {
            [SVG_PROPERTIES.viewBox]: `0 0 ${this.data.width} ${this.data.height}`,
            width: `${this.data.width}px`
        });
        addSVGProperties(this.background, {
            width: `${this.data.width}px`
        });
        this.updateChildren();
    }

    public addChild(child: Graphic): IsometricCanvas {
        child.data = this.data;
        this.children.push(child);
        this.svg.appendChild(child.getElement());
        child.update();
        return this;
    }

    public addChildren(...children: Graphic[]): IsometricCanvas {
        children.forEach((child: Graphic) => this.addChild(child));
        return this;
    }

    public removeChild(child: Graphic): IsometricCanvas {
        const index = this.children.indexOf(child);
        if (index >= 0) {
            this.children.splice(index, 1);
            this.removeSVGChild(child);
        }
        return this;
    }

    public removeChildren(...children: Graphic[]): IsometricCanvas {
        children.forEach((child: Graphic) => this.removeChild(child));
        return this;
    }

    public removeChildByIndex(index: number): IsometricCanvas {
        if (index >= 0 && index < this.children.length) {
            const [ child ] = this.children.splice(index, 1);
            this.removeSVGChild(child);
        }
        return this;
    }

    public clear(): IsometricCanvas {
        const children = this.children.splice(0);
        children.forEach((child: Graphic): void => {
            this.removeSVGChild(child);
        });
        return this;
    }

    public addEventListener(event: string, callback: VoidFunction, useCapture = false): IsometricCanvas {
        addEventListenerToElement.call(this, this.svg, this.listeners, event, callback, useCapture);
        return this;
    }

    public removeEventListener(event: string, callback: VoidFunction, useCapture = false): IsometricCanvas {
        removeEventListenerFromElement(this.svg, this.listeners, event, callback, useCapture);
        return this;
    }

}