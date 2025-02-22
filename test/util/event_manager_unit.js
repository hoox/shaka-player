/*! @license
 * Shaka Player
 * Copyright 2016 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

describe('EventManager', () => {
  const Util = shaka.test.Util;

  /** @type {!shaka.util.EventManager} */
  let eventManager;
  /** @type {!Event} */
  let event1;
  /** @type {!Event} */
  let event2;
  /** @type {!EventTarget} */
  let target1;
  /** @type {!EventTarget} */
  let target2;

  beforeEach(() => {
    eventManager = new shaka.util.EventManager();
    target1 = document.createElement('div');
    target2 = document.createElement('div');
    event1 = new Event('eventtype1');
    event2 = new Event('eventtype2');
  });

  afterEach(() => {
    eventManager.release();
  });

  describe('listen', () => {
    it('listens for an event', () => {
      const listener = jasmine.createSpy('listener');

      eventManager.listen(target1, 'eventtype1', Util.spyFunc(listener));
      target1.dispatchEvent(event1);

      expect(listener).toHaveBeenCalled();
    });

    it('listens for an event from multiple targets', () => {
      const listener1 = jasmine.createSpy('listener1');
      const listener2 = jasmine.createSpy('listener2');

      eventManager.listen(target1, 'eventtype1', Util.spyFunc(listener1));
      eventManager.listen(target2, 'eventtype1', Util.spyFunc(listener2));

      target1.dispatchEvent(event1);
      target2.dispatchEvent(event1);

      expect(listener1).toHaveBeenCalled();
      expect(listener2).toHaveBeenCalled();
    });

    it('listens for multiple events', () => {
      const listener1 = jasmine.createSpy('listener1');
      const listener2 = jasmine.createSpy('listener2');

      eventManager.listen(target1, 'eventtype1', Util.spyFunc(listener1));
      eventManager.listen(target1, 'eventtype2', Util.spyFunc(listener2));

      target1.dispatchEvent(event1);
      target1.dispatchEvent(event2);

      expect(listener1).toHaveBeenCalled();
      expect(listener2).toHaveBeenCalled();
    });

    it('listens for multiple events from multiple targets', () => {
      const listener1 = jasmine.createSpy('listener1');
      const listener2 = jasmine.createSpy('listener2');

      eventManager.listen(target1, 'eventtype1', Util.spyFunc(listener1));
      eventManager.listen(target2, 'eventtype2', Util.spyFunc(listener2));

      target1.dispatchEvent(event1);
      target2.dispatchEvent(event2);

      expect(listener1).toHaveBeenCalled();
      expect(listener2).toHaveBeenCalled();
    });

    it('listens for an event with multiple listeners', () => {
      const listener1 = jasmine.createSpy('listener1');
      const listener2 = jasmine.createSpy('listener2');

      eventManager.listen(target1, 'eventtype1', Util.spyFunc(listener1));
      eventManager.listen(target1, 'eventtype1', Util.spyFunc(listener2));

      target1.dispatchEvent(event1);

      expect(listener1).toHaveBeenCalled();
      expect(listener2).toHaveBeenCalled();
    });
  });

  describe('listenOnce', () => {
    it('listens to an event only once', () => {
      const listener1 = jasmine.createSpy('listener1');

      eventManager.listenOnce(target1, 'eventtype1', Util.spyFunc(listener1));

      target1.dispatchEvent(event1);
      expect(listener1).toHaveBeenCalled();
      listener1.calls.reset();

      target1.dispatchEvent(event1);
      expect(listener1).not.toHaveBeenCalled();
    });

    it('listens to an event with multiple listeners', () => {
      const listener1 = jasmine.createSpy('listener1');
      const listener2 = jasmine.createSpy('listener2');

      eventManager.listenOnce(target1, 'eventtype1', Util.spyFunc(listener1));
      eventManager.listenOnce(target1, 'eventtype1', Util.spyFunc(listener2));

      target1.dispatchEvent(event1);

      expect(listener1).toHaveBeenCalled();
      expect(listener2).toHaveBeenCalled();
    });
  });

  describe('unlisten', () => {
    it('stops listening to an event', () => {
      const listener = jasmine.createSpy('listener');

      eventManager.listen(target1, 'eventtype1', Util.spyFunc(listener));
      eventManager.unlisten(target1, 'eventtype1');

      target1.dispatchEvent(event1);

      expect(listener).not.toHaveBeenCalled();
    });

    it('ignores other targets when removing listeners', () => {
      const listener1 = jasmine.createSpy('listener1');
      const listener2 = jasmine.createSpy('listener2');

      eventManager.listen(target1, 'eventtype1', Util.spyFunc(listener1));
      eventManager.listen(target2, 'eventtype1', Util.spyFunc(listener2));
      eventManager.unlisten(target2, 'eventtype1');

      target1.dispatchEvent(event1);

      expect(listener1).toHaveBeenCalled();
    });
  });

  describe('removeAll', () => {
    it('stops listening to multiple events', () => {
      const listener1 = jasmine.createSpy('listener1');
      const listener2 = jasmine.createSpy('listener2');

      eventManager.listen(target1, 'eventtype1', Util.spyFunc(listener1));
      eventManager.listen(target1, 'eventtype2', Util.spyFunc(listener2));

      eventManager.removeAll();

      target1.dispatchEvent(event1);
      target1.dispatchEvent(event2);

      expect(listener1).not.toHaveBeenCalled();
      expect(listener2).not.toHaveBeenCalled();
    });

    it('stops listening for an event with multiple listeners', () => {
      const listener1 = jasmine.createSpy('listener1');
      const listener2 = jasmine.createSpy('listener2');

      eventManager.listen(target1, 'eventtype1', Util.spyFunc(listener1));
      eventManager.listen(target1, 'eventtype1', Util.spyFunc(listener2));

      eventManager.removeAll();

      target1.dispatchEvent(event1);

      expect(listener1).not.toHaveBeenCalled();
      expect(listener2).not.toHaveBeenCalled();
    });
  });
});
