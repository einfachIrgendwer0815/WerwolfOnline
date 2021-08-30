import { trigger, transition, style, query, animateChild, group, animate } from '@angular/animations';

export const slideRight = [
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
    style({ left: '-100%' })
  ]),
  query(':leave', animateChild()),
  group([
    query(':leave', [
      animate('1500ms ease-in-out', style({ left: '100%' }))
    ]),
    query(':enter', [
      animate('1500ms ease-in-out', style({ left: '0%' }))
    ])
  ]),
  query(':enter', animateChild())
]

export const slideLeft = [
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
    style({ left: '100%' })
  ]),
  query(':leave', animateChild()),
  group([
    query(':leave', [
      animate('1500ms ease-in-out', style({ left: '-100%' }))
    ]),
    query(':enter', [
      animate('1500ms ease-in-out', style({ left: '0%' }))
    ])
  ]),
  query(':enter', animateChild())
]

export const overlay = [
  style({position: 'relative'}),
  query(':enter, :leave', [
    style({position: 'absolute', top: 0, left: 0, width: '100%'})
  ]),
  query(':leave', [
    style({'z-index': 9000})
  ]),
  query(':enter', [
    style({'z-index': 10000, opacity: 0}),
  ]),
  query(':leave', animateChild()),
  group([
    query(':enter', [
      animate('700ms ease-out', style({ opacity: 1}))
    ]),
    query(':leave', [
      animate('700ms ease-out', style({ opacity: 0  }))
    ])
  ])
]

export const overlayLeft = [
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
    style({ left: '100%' , 'z-index': 10000})
  ]),
  query(':leave', animateChild()),
  query(':enter', [
    animate('1500ms ease-in-out', style({ left: '0%' }))
  ]),
  query(':enter', animateChild())
]

export const overlayRight = [
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
    style({ left: '-100%', 'z-index': 10000 })
  ]),
  query(':leave', animateChild()),
  query(':enter', [
    animate('1500ms ease-in-out', style({ left: '0%' }))
  ]),
  query(':enter', animateChild())
]
