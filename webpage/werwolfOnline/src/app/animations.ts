import { trigger, transition, style, query, animateChild, group, stagger, animate } from '@angular/animations';

const slideRight = [
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

const slideLeft = [
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

const overlay = [
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

const overlayLeftIn = [
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

const overlayLeftInWithOpacity = [
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
  group([
    query(':leave', [
      animate('1500ms ease-in-out', style({ opacity: 0 }))
    ]),
    query(':enter', [
      animate('1500ms ease-in-out', style({ left: '0%' }))
    ]),
  ]),
  query(':enter', animateChild())
]

const overlayLeftOut = [
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
    style({ left: '0%' , 'z-index': 9000})
  ]),
  query(':leave', [
    style({ 'z-index': 10000 }),
    query('.back', [
      style({ position: 'absolute' })
    ])
  ]),
  query(':leave', animateChild()),
  query(':leave', [
    animate('1500ms ease-in-out', style({ left: '-100%' }))
  ]),
  query(':enter', animateChild())
]

const overlayLeftOutWithOpacity = [
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
    style({ left: '0%' , 'z-index': 9000, opacity: 0})
  ]),
  query(':leave', [
    style({ 'z-index': 10000 }),
    query('.back', [
      style({ position: 'absolute' })
    ])
  ]),
  query(':leave', animateChild()),
  group([
    query(':enter', [
      animate('1700ms ease-in-out', style({ opacity: 1 }))
    ]),
    query(':leave', [
      animate('1500ms ease-in-out', style({ left: '-100%' }))
    ]),
  ]),
  query(':enter', animateChild())
]

const overlayRightIn = [
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

const overlayRightInWithOpacity = [
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
  group([
    query(':leave', [
      animate('1500ms ease-in-out', style({ opacity: 0 }))
    ]),
    query(':enter', [
      animate('1500ms ease-in-out', style({ left: '0%' }))
    ]),
  ]),

  query(':enter', animateChild())
]

const overlayRightOut = [
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
    style({ 'z-index': 9000 })
  ]),
  query(':leave', [
    style({ 'z-index': 10000})
  ]),
  query(':leave', animateChild()),
  query(':leave', [
    animate('1500ms ease-in-out', style({ left: '100%' }))
  ]),
  query(':enter', animateChild())
]

const overlayRightOutWihtOpacity = [
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
    style({ 'z-index': 9000, opacity: 0 })
  ]),
  query(':leave', [
    style({ 'z-index': 10000})
  ]),
  query(':leave', animateChild()),
  group([
    query(':enter', [
      animate('1500ms ease-in-out', style({ opacity: 1 }))
    ]),
    query(':leave', [
      animate('1500ms ease-in-out', style({ left: '100%' }))
    ]),
  ]),
  query(':enter', animateChild())
]

class Animations {
  slideRight = slideRight;
  slideLeft = slideLeft;
  overlay = overlay;
  overlayLeftIn = overlayLeftIn;
  overlayLeftInWithOpacity = overlayLeftInWithOpacity;
  overlayLeftOut = overlayLeftOut;
  overlayLeftOutWithOpacity = overlayLeftOutWithOpacity;
  overlayRightIn = overlayRightIn;
  overlayRightInWithOpacity = overlayRightInWithOpacity;
  overlayRightOut = overlayRightOut;
  overlayRightOutWihtOpacity = overlayRightOutWihtOpacity;
}

export const animations = new Animations();
