import QuillChromes from "../quill-blot-resizer";
import ChromeHooks from "./chrome-hooks";

interface ShiftAttributes {
    startShift: number;
    endLeft: number;
    index: number;
}
interface ShiftWithElement extends HTMLDivElement, ShiftAttributes {
    prev: ShiftWithElement;
    next: ShiftWithElement;
}

const MIN_WITH_COLUMN = 26;
const RESIZE_AREA_WIDTH = 6;

export default class TableChromeHooks extends ChromeHooks {

    chromes: QuillChromes;
    table: HTMLElement | undefined;
    row: HTMLTableRowElement | undefined;

    pageX: number = 0;
    curGrip: ShiftWithElement | undefined;
    boundsWidth: number;
    grips: ShiftWithElement[] = [];


    constructor(chromes: QuillChromes) {
        super(chromes);
        this.table = chromes.currentChrome?.getTargetElement();
        this.boundsWidth = chromes.overlay.clientWidth;

        const root = chromes.quillRoot;
        const rootParentWidth = chromes.quillRootContainer.clientWidth;
        const left = chromes.quillRootContainer.offsetLeft;

        this.chromes = chromes;
    }

    onCreate() {

        //window.addEventListener("resize", this.onWindowResize);

        this.row = this.table?.getElementsByTagName('tr')[0];
        if (!this.row) return;
        const columns = this.row.children;
        if (!columns) return;


        let offset = 0;
        const tableHeight: number = this.table?.clientHeight?? 0;

        let prev: ShiftWithElement | null = null;

        for (let i = 0; i < columns.length - 1; i++) {

            const col = columns[i] as HTMLTableColElement;
            var width = col.offsetWidth;
            const grip = this.createGrip(tableHeight, prev,
                {
                    index: i,
                    startShift: +this.percentWidth(offset),
                    endLeft: +this.percentWidth(offset + width)
                });
            prev = grip;

            offset += width;

            this.chromes.overlay.appendChild(grip);
            this.setListeners(grip);
            this.grips.push(grip);
        }

    }

    onDestroy() {

        document.removeEventListener('mousemove', this.documentMouseMove);
        document.removeEventListener('mouseup', this.documentMouseUp)
        this.grips.forEach(grip => this.chromes.overlay.removeChild(grip));

        while (this.grips.length) {
            const grip = this.grips.pop();
            grip?.removeEventListener('mousedown', this.onMouseDown);
            grip?.removeEventListener('mouseover', this.onMouseEnter);
            grip?.removeEventListener('mouseout', this.onMouseOut);
        }


        //window.removeEventListener("resize", this.onWindowResize);


    }

    clearReplaceGrip(grip: ChildNode) {
        const clone = grip.cloneNode(true);
        grip?.parentNode?.replaceChild(grip, clone);
    }

    onUpdate() { }

    onWindowResize = (event: Event) => {
        debugger;

    }

    createGrip(height: number, prev: ShiftWithElement | null, shiftParams: ShiftAttributes): ShiftWithElement {
        const div = document.createElement('div');
        const grip: ShiftWithElement | any = Object.assign(div, { ...shiftParams, prev: prev, next: null });

        const style = {
            display: 'inline',
            top: 0,
            width: `${RESIZE_AREA_WIDTH}px`,
            position: 'absolute',
            cursor: 'col-resize',
            userSelect: 'none',
            height: `${height}px`,
            'margin-left': `${-(RESIZE_AREA_WIDTH / 2 + 1)}px`,
            'left': `${shiftParams.endLeft}%`
        };
        Object.assign(grip.style, style);
        if (prev) {
            prev.next = grip;
        }

        return grip;
    }

    setListeners(grip: HTMLDivElement) {

        grip.addEventListener('mousedown', this.onMouseDown);

        grip.addEventListener('mouseover', this.onMouseEnter);

        grip.addEventListener('mouseout', this.onMouseOut);

        document.addEventListener('mousemove', this.documentMouseMove);

        document.addEventListener('mouseup', this.documentMouseUp);

    }

    onMouseEnter = (event: MouseEvent) => {
        if (!(event.target instanceof HTMLDivElement)) {
            return;
        }
        const grip = event.target as ShiftWithElement;
        const body = this.row?.parentNode as HTMLElement;
        body.childNodes.forEach(child => {
            const row = child as HTMLTableRowElement;
            let col = row.children[grip.index] as HTMLElement;
            Object.assign(col.style, { 'border-right': '1px solid #0d84fc' });
        })

    }

    onMouseOut = (event: MouseEvent) => {
        if (!(event.target instanceof HTMLDivElement)) {
            return;
        }
        const grip = event.target as ShiftWithElement;
        const body = this.row?.parentNode as HTMLElement;
        body.childNodes.forEach(child => {
            const row = child as HTMLTableRowElement;
            let col = row.children[grip.index] as HTMLElement;
            Object.assign(col.style, { 'border-right': '' });
        })
    }

    documentMouseMove = (event: MouseEvent) => {
        if (this.curGrip) {
            const diffX = event.pageX - this.pageX + RESIZE_AREA_WIDTH;

            const left = this.absoluteWidth(this.curGrip.endLeft) + diffX;
            const startShift = this.curGrip.prev ? this.curGrip.prev.offsetLeft : this.absoluteWidth(this.curGrip.startShift);
            const endShift = this.curGrip.next ? this.curGrip.next.offsetLeft : this.chromes.overlay.offsetWidth;

            const allowResize = diffX > 0 ? left < endShift - MIN_WITH_COLUMN : left > startShift + MIN_WITH_COLUMN;

            if (allowResize) {
                const nextIndex = this.curGrip.next ? this.curGrip.next.index : this.curGrip.index + 1;
                let nextColumn = this.row?.children[nextIndex];
                const oldWidth = this.curGrip.next
                    ? this.absoluteWidth(this.curGrip.next.endLeft - this.curGrip.next.startShift)
                    : this.chromes.overlay.offsetWidth - this.absoluteWidth(this.curGrip.endLeft);
                const percentNextWidth = this.percentWidth(oldWidth - diffX - 1);
                nextColumn?.setAttribute('width', `${percentNextWidth}%`);

                let column = this.row?.children[this.curGrip.index];
                const percentCurWidth = this.curGrip.endLeft - this.curGrip.startShift + (+this.percentWidth(diffX));
                column?.setAttribute('width', `${percentCurWidth}%`);

                this.curGrip.style.left = `${this.percentWidth(left)}%`;
            }
        }
    }

    documentMouseUp = (event: MouseEvent) => {
        if (!this.curGrip) {
            return;
        }
        this.curGrip.endLeft = +this.curGrip.style.left.replace('%', '');

        if (this.curGrip.next) {
            this.curGrip.next.startShift = this.curGrip.endLeft;
        }
        this.curGrip = undefined;
    }

    percentWidth(width: number) {
        const percent = 100 * width / this.chromes.overlay.offsetWidth;
        return percent.toFixed(2);
    }

    absoluteWidth(percent: number) {
        const abs = percent / 100 * this.chromes.overlay.offsetWidth;
        return abs;
    }

    onMouseDown = (event: MouseEvent) => {
        if (!(event.target instanceof HTMLElement)) {
            return;
        }

        this.curGrip = event.target as ShiftWithElement;
        this.curGrip.endLeft = +this.percentWidth(event.target.offsetLeft);

        if (this.curGrip.next) {
            this.curGrip.next.startShift = this.curGrip.endLeft;
        }

        this.pageX = event.pageX;
    }

    paddingDiff(col: HTMLElement): number {
        if (this.getStyleVal(col, 'box-sizing') == 'border-box') {
            return 0;
        }
        const padLeft = this.getStyleVal(col, 'padding-left');
        const padRight = this.getStyleVal(col, 'padding-right');
        return (parseInt(padLeft) + parseInt(padRight));

    }

    getStyleVal(element: HTMLElement, css: string) {
        return (window.getComputedStyle(element, null).getPropertyValue(css));
    }

}
