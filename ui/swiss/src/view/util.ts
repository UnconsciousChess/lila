import { Attrs } from 'snabbdom/modules/attributes'
import { h } from 'snabbdom'
import { Hooks } from 'snabbdom/hooks'
import { VNode } from 'snabbdom/vnode';
import { Player } from '../interfaces';

export function bind(eventName: string, f: (e: Event) => any, redraw?: () => void): Hooks {
  return onInsert(el =>
    el.addEventListener(eventName, e => {
      const res = f(e);
      if (redraw) redraw();
      return res;
    })
  );
}

export function onInsert(f: (element: HTMLElement) => void): Hooks {
  return {
    insert(vnode) {
      f(vnode.elm as HTMLElement)
    }
  };
}

export function dataIcon(icon: string): Attrs {
  return {
    'data-icon': icon
  };
}

export function miniBoard(game) {
  return h('a.mini-board.parse-fen.is2d.mini-board-' + game.id, {
    key: game.id,
    attrs: {
      href: '/' + game.id + (game.color === 'white' ? '' : '/black'),
      'data-color': game.color,
      'data-fen': game.fen,
      'data-lastmove': game.lastMove
    },
    hook: {
      insert(vnode) {
        window.lichess.parseFen($(vnode.elm as HTMLElement));
      }
    }
  }, [
    h('div.cg-wrap')
  ]);
}

export const ratio2percent = (r: number) => Math.round(100 * r) + '%';
export const userName = (u: LightUser) => u.title ? [h('span.title', u.title), ' ' + u.name] : [u.name];

export function player(p: Player, asLink: boolean, withRating: boolean) {

  const fullName = userName(p.user);

  return h('a.ulpt.user-link' + (fullName.length > 15 ? '.long' : ''), {
    attrs: asLink ? { href: '/@/' + p.user.name } : { 'data-href': '/@/' + p.user.name },
    hook: {
      destroy: vnode => $.powerTip.destroy(vnode.elm as HTMLElement)
    }
  }, [
    h('span.name', fullName),
    withRating ? h('span.rating', ' ' + p.rating + (p.provisional ? '?' : '')) : null
  ]);
}

export function numberRow(name: string, value: any, typ?: string) {
  return h('tr', [h('th', name), h('td',
    typ === 'raw' ? value : (typ === 'percent' ? (
      value[1] > 0 ? ratio2percent(value[0] / value[1]) : 0
    ) : window.lichess.numberFormat(value))
  )]);
}

export function spinner(): VNode {
  return h('div.spinner', [
    h('svg', { attrs: { viewBox: '0 0 40 40' } }, [
      h('circle', {
        attrs: { cx: 20, cy: 20, r: 18, fill: 'none' }
      })])]);
}
