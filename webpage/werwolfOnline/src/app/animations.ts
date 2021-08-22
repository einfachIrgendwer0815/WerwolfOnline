import { trigger, transition, style, query, animateChild, group, animate } from '@angular/animations';

export const moveRight = [
  style({ position: 'relative' }),
  query(':enter, :leave', [
    style({
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%'
    })
  ]),
  query(':enter', [
    style({ left: '-100%' }),
  ]),
  query(':enter header', [
    style({
      position: 'absolute',
    })
  ], {optional: true}),
  query(':leave', animateChild()),
  query(':leave header', [
    style({
      position: 'absolute',
    })
  ], {optional: true}),
  group([
    query(':leave', [
      animate('500ms ease-out', style({ left: '100%' }))
    ]),
    query(':enter', [
      animate('500ms ease-out', style({ left: '0%' }))
    ])
  ]),
  query(':enter', animateChild()),
]

export const moveLeft = [
  style({ position: 'relative' }),
  query(':enter, :leave', [
    style({
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%'
    })
  ]),
  query(':enter', [
    style({ left: '100%' }),
  ]),
  query(':enter header', [
    style({
      position: 'absolute',
    })
  ], {optional: true}),
  query(':leave', animateChild()),
  query(':leave header', [
    style({
      position: 'absolute',
    })
  ], {optional: true}),
  group([
    query(':leave', [
      animate('500ms ease-out', style({ left: '-100%' }))
    ]),
    query(':enter', [
      animate('500ms ease-out', style({ left: '0%' }))
    ])
  ]),
  query(':enter', animateChild()),
]
