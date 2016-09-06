import {Mouse} from './../utils/Mouse';
import {Calc} from './../utils/Calculator';
import {ToolControlType} from './ToolControlType';
import {RotationControlType} from './RotationControlType';

export class ToolControl extends PIXI.Sprite {

    static get DELETE() {
        return 'delete';
    }
    static get MOVE_START() {
        return 'moveStart';
    }
    static get MOVE() {
        return 'move';
    }
    static get MOVE_END() {
        return 'moveEnd';
    }
    static get ROTATE_START() {
        return 'rotateStart';
    }
    static get ROTATE() {
        return 'rotate';
    }
    static get ROTATE_END() {
        return 'rotateEnd';
    }


    constructor(type, options, rotationControlType) {
        super();
        this.type = type;
        this.options = options || {
                canvasOffsetX: 0,
                canvasOffsetY: 0,
            };
        this.rotationControlType = rotationControlType;

        this.currentRadian = 0;
        this.currentRotation = 0;

        this.buttonMode = true;
        this.interactive = true;
        this.defaultCursor = 'inherit';

        this._localPoint = new PIXI.Point();
        this.canvasOffsetX = this.options.canvasOffsetX;
        this.canvasOffsetY = this.options.canvasOffsetY;

        this.initialize();
        this.render();
        this.addCursorEvent();
        this.addMouseDownEvent();
    }


    initialize() {
        this.g = this.graphics = new PIXI.Graphics();
        this.addChild(this.graphics);
    }


    render() {
        switch (this.type) {
            case ToolControlType.TOP_LEFT:
            case ToolControlType.TOP_CENTER:
            case ToolControlType.TOP_RIGHT:
            case ToolControlType.MIDDLE_LEFT:
            case ToolControlType.MIDDLE_RIGHT:
            case ToolControlType.BOTTOM_LEFT:
            case ToolControlType.BOTTOM_CENTER:
            case ToolControlType.BOTTOM_RIGHT:
                this.drawControl();
                break;

            case ToolControlType.MIDDLE_CENTER:
                this.drawControl();
                break;

            case ToolControlType.ROTATION:
                this.drawRotation();
                break;

            case ToolControlType.DELETE:
                this.drawDeleteButton();
                break;
        }
    }


    drawControl() {
        var innerRectSize = 3;
        var innerRectHalf = innerRectSize / 2;
        var outerRectSize = 5;
        var outerRectHalf = outerRectSize / 2;
        var buttonRectSize = 10;
        var buttonRectHalf = buttonRectSize / 2;

        this.g.clear();
        this.g.beginFill(0xFF33FF, 1);
        this.g.drawRect(-buttonRectHalf, -buttonRectHalf, buttonRectSize, buttonRectSize);
        this.g.beginFill(0xFFFFFF, 1);
        this.g.drawRect(-outerRectHalf, -outerRectHalf, outerRectSize, outerRectSize);
        this.g.beginFill(0x000000, 1);
        this.g.drawRect(-innerRectHalf, -innerRectHalf, innerRectSize, innerRectSize);
        this.g.endFill();
    }


    drawCenter(rotation, width, height) {
        this.rotation = rotation;
        this.g.clear();
        this.g.beginFill(0xFF33FF, 0.0);
        this.g.drawRect(-(width / 2), -(height / 2), width, height);
        this.g.endFill();
    }


    drawRotation() {
        var buttonRectSize = 22;
        var buttonRectHalf = buttonRectSize / 2;
        this.g.clear();
        this.g.beginFill(0xFF3300, 0.5);
        this.g.drawRect(-buttonRectHalf, -buttonRectHalf, buttonRectSize, buttonRectSize);
        this.g.endFill();
    }


    drawDeleteButton() {
        this.texture = PIXI.Texture.fromImage('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAYAAAByDd+UAAAAAXNSR0IArs4c6QAAAbBJREFUSA1jZGBgmALEdAMsUJve0MlGESY6WQS3ZtRCeFBQizEapNQKSbg5RAXpmTNnQnx9fcXgutAYqamp8iA1aMJYucxAUS8g/oZVFir4////r9OmTQu9cePGg5s3b35FVpuUlCTX09MTWFBQsPXWrVsocsjqoGwuoiw8d+7cx9evXz+fPn166O3btx9ev379C8iA+Ph4mf7+/qCEhIQVmzZteoXFAnQhLljRhi6BwZ83b96jv3//rp07d244MzPzKnZ2dqYJEyYEJycnr9y4ceNLDA04BIi2EKR/4cKFT4CWrpk1a1YYiJ+WlrZq3bp1L0BsYgFRiQbZsJ8/f/6D8UG+hLGJpUnyYVBQkATId7m5uWtAFoPYwOBdC/I51S309/cXB8UfMDWuXbJkyVOQBcDgXQmN0/WgOCbGUqJSKSgPAn0RWVxcvH7BggWPYQaDUisoq4BS77t3716AUjNMDgfNxQiUANX4eCtgUKaeOXPm6dmzZz/EZhDIQfX19XYmJiZrsMkjiYkQZSGSBkqZozU+pSGIqZ/kjItpBGkioxaSFl5EqIaVpSJEqKWKEgDQRKPq0bAFxgAAAABJRU5ErkJggg==');
    }


    changeCursor(cursor) {
        console.log(this.type + '.changeCursor(' + cursor + ')');
        this.defaultCursor = cursor;
    }

    addCursorEvent() {
        console.log('addCursorEvent');
        this.mouseover = this.changeCursor.bind(this, this.getCursor());
    };


    removeCursorEvent() {
        this.mouseover = null;
    };


    getCursor() {
        console.log('getCursor(), this.type:' + this.type);
        switch (this.type) {
            case ToolControlType.TOP_LEFT:
                return 'nwse-resize';
            case ToolControlType.TOP_CENTER:
                return 'ns-resize';
            case ToolControlType.TOP_RIGHT:
                return 'nesw-resize';
            case ToolControlType.MIDDLE_LEFT:
                return 'ew-resize';
            case ToolControlType.MIDDLE_CENTER:
                return 'move';
            case ToolControlType.MIDDLE_RIGHT:
                return 'ew-resize';
            case ToolControlType.BOTTOM_LEFT:
                return 'nesw-resize';
            case ToolControlType.BOTTOM_CENTER:
                return 'ns-resize';
            case ToolControlType.BOTTOM_RIGHT:
                return 'nwse-resize';
            case ToolControlType.ROTATION:
                return this.getRotationCursor();
        }
    }


    getRotationCursor() {
        switch (this.rotationControlType) {
            case RotationControlType.TOP_LEFT:
                return "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAYAAADE6YVjAAAAAXNSR0IArs4c6QAAA5hJREFUSA2lVklMU1EUtb/fTlIpihgIG2TYOCxYsGFDYsIGMYoTCVaKGKNpQly4YeOCuHehG5Yk6IKEhaKGUBT6EZtQJRJgQUgaSJgqQylQZvo9p/aZ30mmm9z8++5775x777vv5etOHE90Sbar8T4p3nGIcYRgeXnZhj3EodInFOZfOQ4JESSj0Vi1trZ2D/ZJqEwfNIboqCQCRNra2tKbzebnU1NT1QA3QkkWQ3QYkn/AURA9vvL6+rrkdrv9BoOhfmxsjEQm+qFcH5GDkGjBCcxIDVBGbQKJPD4+LhcXF+enp6c7RkdHWTrOcW1k734kgiASdXSzGV9LQ0NDtqIoVy0Wy+VwOCyhXNkgupCZmWn3+Xy3NSQwUwsJGAQjt0DT8/Lyznu93mp0VNvKyspAf39/V0tLi6u8vHwI82xdNTc3d2Z+fl5ZWlq6j3FM2TCOES3BKcycaW1tLQXw+5GRke7KykqvLMs78EeAtd+CgoKJYDCoBAKBm/CLksGMlXiCs4ODg3Zs9Dgcjm9YqppMplBtba3S1dX1aWJiwtXU1NRNPwkA3jc7O8tyabsslgEjkjBN1j4DBA8WFxf7CYCx6nQ6e5CRsr29/Rr+O6urqy+am5s/FxYW+piB3++/hXVsDJaaWAkisuCi0+3t7aWov4cEaNHNzs7OjwB/Nzc3dwnzkWbY2Nio93g8H0DWGy3RfzMgo8jCAuBziLjDbrd/h191uVwkeNXR0cEmEFHqdnd3H6qq6t3c3LwOP4nFHMzkQhJGYh0aGqoeHh52wVbRrl9B8DZKwDVUig4EDug12hrlXIKIBYyENzaDbVpRUfED92ANpVAmJycvwp8QJQjSEtCSOLQEPIu0xsbGIhziANu0rq6uLxQKvYFfe5gikyRwiS5GRuEm2iyVEZfrCkoVRL3lmpqaEFqyD/4D1RvrEoStegJgdyVJcu7t7UmwJTwThra2tgDn8vPzzTk5Oc92dnacer1e1el0Ybhf4vuF8wcVZqFHSR7hKXCzXa1W6ypadgt+FY/ess1mC5SUlAyjXZVoFx2qXAwkQoKvEW/Ok5mZGXdWVtZvEgglMS8aWvoGfCzbkUh4HpFbPj097QRRryAiAZ+K6E3e96IBJ6UwMnHwFgA+xWH3lJWV/WIGsPkWabsrJdB+E4KIGRlxTx6jEX4uLCxUYXysDOKJBRHrLuOMivA9cusKcILGSzIf1yT8T8VvTDX+A7nQiRk9jngZAAAAAElFTkSuQmCC') 12.5 12.5, auto";
            case RotationControlType.TOP_CENTER:
                return "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAOCAYAAAA8E3wEAAAAAXNSR0IArs4c6QAAAyRJREFUOBGNVF1IU2EY9pz9z9YkRdaPIfhHiV4V3Sy80S4jijLqwvDGO/Uq6KLLqBtpN+G9SndJmSBZlDYbNjeGLWSW2CQxt0E65+bmfk7Pc/I7HRdELzx7v/d7f7/3fc+kiv8jSWemPyu6e/1Zd334qHemhrJwFDryctCWRNtyiHvyv0gflEohC0PKMmDQcZFcJCpBVwQEF/e40uLxjqQwmAggJ5PJ85AZnDACZsAK2IBKwK5DuWyBjvb0EzEY8xxkfR41IQ3MhULBt7y8fBHnI8BR4FhLS8uJ2dnZqxsbG4/hPJnNZkPAJ2BxZ2dnKhaLPfH7/bc7OztP0x5wACymErpr+Xz+Gc4mgDnUDjI7q7JDGUqn03PT09OXqqurTwaDwTu7u7tvw+Hw68HBwZnW1tavJpMpB1vFaDTmUcxqb2/vnM/newW/D5FIZKC9vf0U9LVLS0s39/b2/Llc7jlkdog5JDEjCpb9/X1vV1eXPDExkYbhWiKRqO3p6XEFAoEzkiQpCPYFSLhcrlw8HjejG1ULCwtni8Wiob6+/vvo6Gikra0tH41G39TV1V3v6+uTR0ZG4na7/Rbis9ACoPaXvXciySK40tHR8dnj8bwzGAwFh8ORHBoamkqlUu/R8nHYPALuAQ8hP81kMnNjY2OTNTU1Cfr29/d7Nzc3PzY1Na01NzdH0aFJ3LPNbKvWUias4mzAxZYpbrc7vLW15UWyBysrK43QcQ4cgQa85jiS3gW83d3d8/Q3m81q23UJuQ9qQjqSmKTEtqnSwY/NZitYLJYKVPyysbExSpsyKGhlDC3zYF7jw8PDRXQkhdHwASTlICb9tNh8prY0BwrtlZhpAAFmtre3ud5qS8D1JGNhrmBjZxoaGr5Bofnihavo2gvccWnULWUAgi81YPjzoVDoh6IoamBWhzmWEKgSlbPqAdwFwTWC7WUI97FEP9fX1/P0Ff7wkeCbxWbfgA3/HNTAomoZs3KjIhmJ1TskU6xWawmfAD8DIqNPiMCs+gKWxwBIhN4f4yjJspx2Op0sUn25SFbOoT9ENCYJ/lv68/svf72P8gunF5KUe/EFxQAAAABJRU5ErkJggg==') 14 7, auto";
            case RotationControlType.TOP_RIGHT:
                return "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAYAAADE6YVjAAAAAXNSR0IArs4c6QAAA7JJREFUSA2lVN1Lk2EU9913s9KUNJYQpjOiIK8kKNCIrszoY5UhY7MPbwTvveofCLrx3hvtYlAQeiFstNxmgpalDkQQl6BN58Tp/Hbb2+/3sic219xLHTg85z3POc/vPef5PUcqyhUp16V45Dz+gm7NkQgCUOnXJBKJJ2kbi+Ln+l8iDtfhFOP29vbLVCrlh62HaqH5KsTW8SIqERXwMP3q6mr7/v6+PZlMct8ApV+pDquIhalOmCiSaOuXlpaeHx4ePmtoaLiAdtFnghJIVCSqEnnYOl54CIUJ2pWVFYckSY/r6+svwy5Huwxer/dWd3e3BfsnoAKQLc0Ew+fxQgBdLBbrCIfD3oqKigi+ZYPBsN/b2+sJBALuzc3NMey7JicnW2tra89i/zSUoKxOdANmfpFwB5fQ/29NTU0/EEaqZqlOpztsbm7+Oj09TcABl8t1EzFnoMVQVUBKq6LR6MONjQ0f/vQnEuWSkpJYKBQa9ng8Q+3t7X6z2bxFv91u/4KqRicmJuz4LoeqAiKIculol219fd1PoNLS0nUwbHRubu4p6NwTj8d9XV1dnwjE/bW1tZE0UBl8ZijviWflFQFkwIU/YkVgVxAs8yODvTcsLCxcOTg46He73YO4rz0CIW60r6/vBvZLoEaoIAPMv4sA0qPv93d3d31g1zBC+YesVDMwMGAG0NuhoaFBfMtOpzOA2I/V1dWV+GbbClaDGKVcHqjd29u7J8uyF7ZgD39CSgO96+zs5J4cDAY94+PjrbBLoayG8QVFOQxREkBuc00rE2lrlpeXr6ICn8lk2m5paRknveEnCdjagi1DTEEhECvtcTgcPtIbgGMghRX+k9BMSjNWXWkMTIuSBFsC44bb2triGD06vJ+YzWa7Bj8BxDQQbZPoUCVoHf/SxqEJ1kk4/HxdXR1nWhFoLt2BYD2H95SAJo1GYwpP4AOeQkw1CGbaFoCiWq32NS46PDU1pQPdlcr6+/srdnZ2NJCLVqs10djYWAl2vgHApqoKjgRJZB0e5ueampoQ9rLGT1VV1a9IJOJfXFx0Yo/D9J9IoFw6psIDPlgALQggi8USButGZmdnX8F3CspWCvrDVC8EYaKek0GMIFaA78DMzEwH9vhecqpgolCYBUUAGTjrWBGmuG9+fv4FMjleCMC7/lMFE0g79jaVXmkXEvFTWlRzF4QoLisre4+kZFoz76pIAiUnwBwZzLh+JEAtkADMOhjJWT8rg/ff4eRIYJlMUisCIHPNyf0N6iStCymROgkAAAAASUVORK5CYII=') 12.5 12.5, auto";
            case RotationControlType.MIDDLE_LEFT:
                return "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAcCAYAAABRVo5BAAAAAXNSR0IArs4c6QAAAz9JREFUOBFtVN9LU3EU997b7nJrG+hkYWKGOEFBIhdIWFHMFx+iN4NASv+A8EXfetxTkD304rNo0INgVhhkybURbmuwcDCnDRNxOtT9cIr7cW+f83Xf23XswNn5nvP9fs4538/33Al1F0W46Nb0NIpeMmwRqFr5Nh3mSjHNCKQAAUUoxaWKTzEVWoaWKlavyCplMplei8UyoaqqVC6XRVhKUicIgiZJkkp6cnLiczgcQV6R2hAQ+LW3tzdjt9snhoeH1UgkcpWAENbm/Px8zOVyWeFTIV3IoUSWaDT65ODgwN/R0bEFn99NCwQCn5LJ5EPERNYKFkYRurq6lra3t98ripKUZblg3ORrDmR3RJB8saenR25ra/P6fL4CRLbZbDkCVO5KHehCQGKxHtqwvr7+Ynl5+QvW2tDQ0M/Dw8Mf7e3tiVAotJDL5e4jzguyhYyAzev1tubzeT8q/nU6nSmwqOC+Y9ls9juIWzw9Pb2Hc1SI/VC1y9CG1dXVp36/fxFrbXp6euH4+HgcaxnJHmuaFigWi3fh60Bik2huQta3IyMjK3izEqqtJBIJehJ2dwAfQe/AZ0JoE9QGdaGlz263+09fX1+kVCrNIMYnCEu0oWnks0wE5CqC/ubNzc3Wzs7ONKZni85WFAYHBYFG7z87FKMARABAwoTQ+2VZpMaPTiv2eOayyWQq7O7umhFz1MCwEJHCAcyenZ3t4I5XMKdNIMiNfX4Nut8tQqHdEK9IIOpdBe3xgYGBHQDdeDPnxsbGDcSldDrdC/sGhFlgBSOQvrlSPB5XRkdHi8guTE1N5XHX54h58Lm9wtQUAORc4Pg5SexJwGYzHv2rx+OJYkYzR0dHCk0PJioUDoc/VI8cZdFnFTP5bG1tbYmGoL+//zdaD2NfCwaDH1Op1INKIZhzAqhtmld7Y2Pjtf39/XeTk5Pf4OvkGb/HC/8A/NDs7Gy32Wy+Pjc3R9NUUzhQ34zFYjdbWlpeDg4OWvFpdesbWBi/R84QWQF/VretVutrMFpPrHIlgCiKKlQDUWMgTeFASkxruieRRJ2QZQMNy54Klv89qtVAVhkHeBIsmegEwaMk+mCz3SrfmJT2CcxF+wduL3Nt3V5HIgAAAABJRU5ErkJggg==') 7 14, auto";
            case RotationControlType.MIDDLE_RIGHT:
                return "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAcCAYAAABRVo5BAAAAAXNSR0IArs4c6QAAAztJREFUOBF9VN9rUnEU915NS5BV2JRqa7CYkOAeEgqmSTF7jC2IPfU22Nvajzehl6CHHmR/xN6FbCP6icsZgYrDLXFzNFcgONlQNyf+urfP+d77vdwN6sC53+/3nPM53/PrewWDQoK60qLf01mmj0ra3gQBNxTVPZ25jOwlMAE4iK0EJCKQEUxnYjoT9VTuqisHMyPh+PjYZ7ValyRJEsCiLMsCiD6cm41GY76vry9J3kDMgVipVB6mUqlVVUBCxoFAIAvA+vb2th+yC2AeibLp9XoC3QKFRgD9jEajjUQi8crlcm1oCnXDczwvN0xOTlZarVZ5YmJiC0p9wWgvs6uNRiPLhdDBYHDD5/NtLS4u+pFCfzwefwwxXUDFOxOViOIEMpnMO4BSp6en8aOjo3WbzVbzer25k5OTLwj1OkA28Jk8hWaz+aBer39tt9uxQqFwH45eh8Ph9zCUNzc3P62trT3F/gr4Ili7Weh0On4UZ71arXqhMO3u7t4G+BvaIc3NzcVKpdIS5NfAVtKDlZABukusCkho7Ha7kdHR0bzb7S7UarUVyBxgHq7AigPPaWIotB6iRQWPx1PZ2dkZtFgsN6AjhxprDYXwPNWcTmcLaZih4HkpIULwP6Dt4ODAbDKZaE7ZiOlWBYj8yCMnFg56ewujdnl4ePgPql2CUv9KlAGA8B7AT7BSBEKxWOyH8WAymbwzNjZWQrt+qUAOVgxRQbrxJQaawCa73f48EolUUSDj9PR0Y39//zvk/InxsA1sAMrl8gcMQezw8HCepgfgytDQ0G84S4yPjw8CSK2gQml1YSOXTqdXkM8exi0xNTX1AwYyJuZjPp9/gf1V8CUwry628KB/j5jROmTy7OxsHJO0il7exFl/G2sJu1b/HjFqNjS8HQqFzCjS52w22waQisILw3LU4oVCI7xDMx6yY2Bg4Fkul3sEhVYQbsQeMm6QEKIwMjKyBwXrI9pjmJmZEZeXlxdQuI7D4Xir6pgTZoQh9uJnFULIIjFASh6iKGEQJFEUe6j0G/ysUurtzICBIaCK8ZdOKZBnYuofjZ0+T/Vd6aYeBtwRtoy4A/2qAcmChafY/vNLYEZ/ARukibLGcoOhAAAAAElFTkSuQmCC') 7 14, auto";
            case RotationControlType.BOTTOM_LEFT:
                return "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAYAAADE6YVjAAAAAXNSR0IArs4c6QAAA6lJREFUSA2lVUlLW1EUNiZGY4zGxhoiIggqQqtLEVqo0KVYOqTowqYKHRFcdeOy/oFuCl260S5EkFYLYtLGTKTUKg3RhSixLpI4GzXikOH1+0KuxDHRHji8e84993xnuvfJss4n2Tlq6RxdRirFKSvhnF/BdC4AxPfUscvF7JRt4ZQ6gis3Nzfbtra2HmAtB4t9LK9GIhPhQADk+nw+YywWe65UKrOCwaDcYDB8heto0v21MiIIo80Da2dnZ1+vrKw4y8vLA1VVVX+RjQPyE+zlgBkI7a9EPMCDSrBmbm7u5fLysqusrCwIOdEPAm1vb9sB9gg6UTosM6fjLPx+f+fq6qqDGeB4AkB8q6urfbu7uxMHBwfs0ZUyoXEik3A43KpSqd7ZbLaV+fl5RTwezx4eHi4ZHx+v7+3t/a7X64/q6+ujjY2NBpx5L5PJRvHNiBKND4VChXK5XIVIP9XW1sorKioU+fn5deA4QLJMJpOk0+l+KhQKP4ZBgm2JJEkFAApnhAIjkQ1rzcaqwMV2u93ocrnGsZYA9G1jY+Mp1gxK2GOZGbHhYhzjWMfAHNPI0NCQp66uTovoowMDAxq1Wn0vxVacgerqxCiZEbPRoYyDLS0tk3l5eXs7Ozt2TN1t6FNHOJEVSncfepEhv2mJTnLB2snJybaZmRkL1lJXV5f16Ojo88jISD7kVIfZALEmp44BpgYB8XyiA9ZeXVlZqUcGXzo6OpyQpbGxsVEAfUgC0RmZk2jb39+3w/Yh5IwuLEEYEbMp6u/vv4OL6OaFxBNzYDabCTSwtLR0C/u8wKpIJOJoaGjw8sImXwbq02YksmFpbkxPTz/DdLkIBFnq7u7+gXG37+3tfVxYWGg9PDx0a7XaLfEE4a0zwi5tRgRhJDRUg3UAMmEQ3O3t7W7IEu5QuLOz02GxWMYWFxdtRUVFIerFE7S+vv4YMitCXxfSaaDiwcHBu6j7iNfrNTc3N//GeEdw+sTzQ7mpqekPLu3U2tpaDeRLQYieCsSxLkSkNz0eTxvHGz345XQ6zX19fRb06xD7Umlp6SrKNYH9V5DF5cXychJAPMCGsk8acHFPT0+N1Wo1ojdTGo1mlwCBQGACzX+LfQ5O2nLB5pgIlArGXvHfUwDWYXwT0wcAG17yLugYCINKO2GwOUOpYIySmakxwi78qm3owRvILGvayYJNRkRAAuXgMjpRshdYs0TXzgBnz5DISh6NRluxS0DymRLR8H/oovMnXul/F7SWjoEFkdEAAAAASUVORK5CYII=') 12.5 12.5, auto";
            case RotationControlType.BOTTOM_CENTER:
                return "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAOCAYAAAA8E3wEAAAAAXNSR0IArs4c6QAAAy1JREFUOBF9VE1IG1EQdpNs/jQNiAlW0h8UYkEIWCN4EQ/V3irFXgoFLd682PRorz3YS6iXHjwK4qktLRWkhlKtqWColcSSotEmXiS2KElM1MRkt9+87ixbKX3wMfPmzcw3M5mNVPfnSJokYdTZrGoKS7az5BiWbGfJcSo7kJTy+XyXoij15XLZRJ5ms1m12+2KxWJRNdRgXpMkiaQ4qqp2VatVJyARzs7OTLVaTeTleJfLFYWzQgEWQJBBmp1O55Pd3V378fGxqAiJVYLP55O9Xm8jfJ4ayXAXB8VMnp6eVhBbApkJRQhCiu3s7LwMpx7NVZDSoxlwoLq3fr//B3QiFGhra0sXCoWlUql0FzbROaTxSLlcLlipVJYGBga+4EGPJf38/HwD0glwc6JDujQg6TsQpsmRgFEUjo6OPh8eHj7G3QoQoagekg/dLalUqufk5GQFpESgk+LnieN+CZABE1dMQTwKkdBqtVYwWtfY2JjZ4XAMFYvFUDqd9sJP+JI/Y2dn53pzc/MdJK/DaKl4/Wjj/atQSkDsLiSdR4eZ9vb2TDabXRsfH1+BXW1qavo1Ozs7jw6iWIw5JJ4EJoBnuL9GYZ/C4fACJpLHolSnpqY+9vX1faNY+FCHbkBMiMgIVJUNCeeGh4e909PTyt7e3svW1tZb8XhcHhkZuZHJZK4gWa27uzuJgnLoqLy/v29PJBIewE+dBIPB7zMzM1mPx/PTZrNdGxwcrI9EIgqm1Yv8ZaAK6IQOVPMGI4klk8n7sHsDgYBve3v7EX7bVZz3o6OjUVoq6gLvqizL5Y6OjlQoFFra3NyMYEIf1tfXH2LbWxYXF28jLnphacRPSB3Slsp4fHVwcHAPer0GF2Rjf3//1Vgs9gBvL7CxC9jmOJAANvDtzqPT58vLy0PovIX8AVqShq2trV6MfBU6jZM4JB6pkPThu93ur3jgQxWRI42cfmfSeVmg6ttI3xd1zaA/BtrUOuS8iZz650JEdC5K4azZ6Y2JWIoCYef1JwIiZcnxMInDd/2vjR8uSmMhTMKSfZnUKOmNScifdb0zDv6fZHLyMep6MtiN+j9z/Qasm4fFL/kTlgAAAABJRU5ErkJggg==') 14 7, auto";
            case RotationControlType.BOTTOM_RIGHT:
                return "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAYAAADE6YVjAAAAAXNSR0IArs4c6QAAA71JREFUSA2lVUlPU1EYhU6UYi1qJIGwYlghsIGVkQ0JG8QRg4YgjVNMmhB/gQv+gAsXpCtcgFEjJgoaQouFUuwCIYHCCoSSME9lKnR+nvPoNWD7kMYvOX33ft+999xvuk1P+z9JV9guHderjk9SHJOAUK2vrxfjq+Y4rlMih/nsIh+O5dqNjY070Wh0dHt7+xnmGYAGEGQYHk3kQQo/wgPN8vLyTa1W+6K6ulp9eHj4YHV19RHO0QH0SqxL4eijpX88wIF3fT7fUFFRkRcmKScnZ21paWlwcXHRgnkmkOARdGcSkqh3d3dv7ezsOAUBdEy0IBpAjp5jztAJjzA8u6QHAoEbCI2zsrLSYzKZfMA2tks6nS5oNBr3SLy1tTXo9/ufQJ86iSRJ1YAjFosNhsPhoWAw6J6bmxskSXt7ux0Hj+ICbtiGscYViUQaYKP3KYnICeOdOTMz02C323sxllwul83hcNRjfAnIArSAXGX8SVUY/xgQzc3NvdbZ2Zml0WgiZWVlpr6+vgnog0A4vuZEU0KXXBCec39ZZG/m5+dL9vb2nAaDwV9bW/sTffIB6y4AekDkQjFUNMgAwXXAHJ/jc6Tv7u42hEKhzpaWlu/QSR6PxzY+Pn4fYyPAMCkeDptsZAjVrCIQjCB5bDBBrIoTvLLZbD3QS01NTT9Q0t2oqsuYGwDmS5GEBhJo0WS3EYoBt9v9BdXyOL5RvbKycgUevO3t7e1ByQZYrgiTu6ur6yrWnAfY7TwjKYkg0LGT2WiFhYVzVqv1G8hebm5u3sPhr3Fjp8ViceAQiQTQD4+NjTVhzlyILj+VQIu3qJ5PBQjmeVBra6vd6/XaUDVfm5ubnXq93k+92Wx24SLuOEFCyWJNgpBZzRDFnwqZADr5qRBflGm4rq5uZHJy0g6PPnd0dDBEF4ETPYF5gjBJlHQkOQshSUPCWR2y1NTUTDQ2Nq4hNFJpaWk2utg7PT39qby83IFOD2AR+4GIAuJSGCaK7AnUmbOzs4+RE1deXt4y5lJbW1s/Xlar0+msR7nyj4mhyQZ4+6T/HdAniPCEt4gWFBR8nJqa0iDWDysqKiSVShU7ODjwVFVV9cMubix3O+bcwzGFY0VhuQk36XKwpKTkPXLzBkS/iouLI+joCPQMDZ+LEHCcTOyF+t/CkJGQnvFZMC4sLJjxtzqGPniKOfOkWP+wnSrHw8WFdJ83jeXn57/b398PZWRksP6pT+nWWK8o9Eh4xUdODU/YaEKvuPE0Azcnk2T6U5Ob7BCh+w13D8jLwsORsAAAAABJRU5ErkJggg==') 12.5 12.5, auto";
        }
    }


    addMouseDownEvent() {
        this._mouseDownListener = this.onMouseDown.bind(this);
        this.on('mousedown', this._mouseDownListener);
    };


    removeMouseDownEvent() {
        this.off('mousedown', this._mouseDownListener);
    };


    addMouseMoveEvent() {
        this._mouseMoveListener = this.onMouseMove.bind(this);
        this._mouseUpListener = this.onMouseUp.bind(this);

        window.document.addEventListener('mousemove', this._mouseMoveListener);
        window.document.addEventListener('mouseup', this._mouseUpListener);
    };


    removeMouseMoveEvent() {
        window.document.removeEventListener('mousemove', this._mouseMoveListener);
        window.document.removeEventListener('mouseup', this._mouseUpListener);
    };



    onMouseDown(e) {
        e.stopPropagation();
        this.prevMousePoint = this.currentMousePoint = {x: e.data.global.x, y: e.data.global.y};

        if(this.type === ToolControlType.ROTATION) {
            this.prevRotation = this.currentRotation = Calc.getRotation(this.centerPoint.globalPoint, {
                x: e.data.global.x,
                y: e.data.global.y
            });
            this.currentRadian = Calc.toRadians(this.currentRotation);

            this.emit(ToolControl.ROTATE_START, {
                target: this,
                type: this.type,
                currentRadian: this.currentRadian,
                currentRotation: this.currentRotation,
                currentMousePoint: this.currentMousePoint
            });

        } else {
            this.emit(ToolControl.MOVE_START, {
                target: this,
                type: this.type,
                currentMousePoint: this.currentMousePoint
            });
        }

        this.addMouseMoveEvent();
        this.removeMouseDownEvent();
    };


    onMouseMove(e) {
        this.currentMousePoint = {x: e.clientX - this.canvasOffsetX, y: e.clientY - this.canvasOffsetY};

        this.changeMovement = {
            x: this.currentMousePoint.x - this.prevMousePoint.x,
            y: this.currentMousePoint.y - this.prevMousePoint.y
        };

        if(this.type === ToolControlType.ROTATION) {
            this.currentRotation = Calc.getRotation(this.centerPoint.globalPoint, {
                x: e.clientX - this.canvasOffsetX,
                y: e.clientY - this.canvasOffsetY
            });

            this.changeRotation = this.currentRotation - this.prevRotation;
            this.absChangeRotation = (this.changeRotation < 0) ? this.changeRotation * -1 : this.changeRotation;

            if (this.absChangeRotation < 100) {
                this.emit(ToolControl.ROTATE, {
                    prevRotation: this.prevRotation,
                    changeRotation: this.changeRotation,
                    currentRotation: this.currentRotation,
                    currentRadian: Calc.toRadians(this.currentRotation),
                    changeRadian: Calc.toRadians(this.changeRotation)
                });
            }
        } else {
            this.emit(ToolControl.MOVE, {
                target: this,
                type: this.type,
                prevMousePoint: this.prevMousePoint,
                changeMovement: this.changeMovement,
                currentMousePoint: this.currentMousePoint
            });
        }

        this.prevRotation = this.currentRotation;
        this.prevMousePoint = this.currentMousePoint;
    };


    onMouseUp(e) {
        this.currentMousePoint = {x: e.clientX - this.canvasOffsetX, y: e.clientY - this.canvasOffsetY};

        this.changeMovement = {
            x: this.currentMousePoint.x - this.prevMousePoint.x,
            y: this.currentMousePoint.y - this.prevMousePoint.y
        };

        if(this.type === ToolControlType.ROTATION) {

            this.currentRotation = Calc.getRotation(this.centerPoint.globalPoint, {
                x: e.clientX - this.canvasOffsetX,
                y: e.clientY - this.canvasOffsetY
            });

            this.changeRotation = this.currentRotation - this.prevRotation;
            this.absChangeRotation = (this.changeRotation < 0) ? this.changeRotation * -1 : this.changeRotation;

            if (this.absChangeRotation < 100) {

                this.emit(ToolControl.ROTATE_END, {
                    target: this,
                    type: this.type,
                    prevRotation: this.prevRotation,
                    changeRotation: this.changeRotation,
                    currentRotation: this.currentRotation,
                    currentRadian: Calc.toRadians(this.currentRotation),
                    changeRadian: Calc.toRadians(this.changeRotation)
                });
            }
        } else {
            this.emit(ToolControl.MOVE_END, {
                target: this,
                type: this.type,
                prevMousePoint: this.prevMousePoint,
                changeMovement: this.changeMovement,
                currentMousePoint: this.currentMousePoint
            });
        }

        this.addMouseDownEvent();
        this.removeMouseMoveEvent();
    };



    set localPoint(value) {
        this._localPoint = value;
    }

    get localPoint() {
        return this._localPoint;
    }

    get globalPoint() {
        if(!this.transform)
            return this._localPoint;
        return this.transform.apply(this._localPoint);
    }


    set transform(value) {
        this._transform = value;
    }

    get transform() {
        return this._transform;
    }


    set centerPoint(value) {
        this._centerPoint = value;
    }

    get centerPoint() {
        if(!this._centerPoint)
            this._centerPoint = {x:0, y:0};
        return this._centerPoint;
    }


}