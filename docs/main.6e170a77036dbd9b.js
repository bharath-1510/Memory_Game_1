"use strict";
(self.webpackChunkProject1 = self.webpackChunkProject1 || []).push([
  [179],
  {
    81: () => {
      function J(e) {
        return "function" == typeof e;
      }
      function Hr(e) {
        const n = e((r) => {
          Error.call(r), (r.stack = new Error().stack);
        });
        return (
          (n.prototype = Object.create(Error.prototype)),
          (n.prototype.constructor = n),
          n
        );
      }
      const ri = Hr(
        (e) =>
          function (n) {
            e(this),
              (this.message = n
                ? `${n.length} errors occurred during unsubscription:\n${n
                    .map((r, o) => `${o + 1}) ${r.toString()}`)
                    .join("\n  ")}`
                : ""),
              (this.name = "UnsubscriptionError"),
              (this.errors = n);
          }
      );
      function zr(e, t) {
        if (e) {
          const n = e.indexOf(t);
          0 <= n && e.splice(n, 1);
        }
      }
      class it {
        constructor(t) {
          (this.initialTeardown = t),
            (this.closed = !1),
            (this._parentage = null),
            (this._finalizers = null);
        }
        unsubscribe() {
          let t;
          if (!this.closed) {
            this.closed = !0;
            const { _parentage: n } = this;
            if (n)
              if (((this._parentage = null), Array.isArray(n)))
                for (const i of n) i.remove(this);
              else n.remove(this);
            const { initialTeardown: r } = this;
            if (J(r))
              try {
                r();
              } catch (i) {
                t = i instanceof ri ? i.errors : [i];
              }
            const { _finalizers: o } = this;
            if (o) {
              this._finalizers = null;
              for (const i of o)
                try {
                  rd(i);
                } catch (s) {
                  (t = t ?? []),
                    s instanceof ri ? (t = [...t, ...s.errors]) : t.push(s);
                }
            }
            if (t) throw new ri(t);
          }
        }
        add(t) {
          var n;
          if (t && t !== this)
            if (this.closed) rd(t);
            else {
              if (t instanceof it) {
                if (t.closed || t._hasParent(this)) return;
                t._addParent(this);
              }
              (this._finalizers =
                null !== (n = this._finalizers) && void 0 !== n ? n : []).push(
                t
              );
            }
        }
        _hasParent(t) {
          const { _parentage: n } = this;
          return n === t || (Array.isArray(n) && n.includes(t));
        }
        _addParent(t) {
          const { _parentage: n } = this;
          this._parentage = Array.isArray(n) ? (n.push(t), n) : n ? [n, t] : t;
        }
        _removeParent(t) {
          const { _parentage: n } = this;
          n === t ? (this._parentage = null) : Array.isArray(n) && zr(n, t);
        }
        remove(t) {
          const { _finalizers: n } = this;
          n && zr(n, t), t instanceof it && t._removeParent(this);
        }
      }
      it.EMPTY = (() => {
        const e = new it();
        return (e.closed = !0), e;
      })();
      const td = it.EMPTY;
      function nd(e) {
        return (
          e instanceof it ||
          (e && "closed" in e && J(e.remove) && J(e.add) && J(e.unsubscribe))
        );
      }
      function rd(e) {
        J(e) ? e() : e.unsubscribe();
      }
      const _n = {
          onUnhandledError: null,
          onStoppedNotification: null,
          Promise: void 0,
          useDeprecatedSynchronousErrorHandling: !1,
          useDeprecatedNextContext: !1,
        },
        oi = {
          setTimeout(e, t, ...n) {
            const { delegate: r } = oi;
            return r?.setTimeout
              ? r.setTimeout(e, t, ...n)
              : setTimeout(e, t, ...n);
          },
          clearTimeout(e) {
            const { delegate: t } = oi;
            return (t?.clearTimeout || clearTimeout)(e);
          },
          delegate: void 0,
        };
      function od(e) {
        oi.setTimeout(() => {
          const { onUnhandledError: t } = _n;
          if (!t) throw e;
          t(e);
        });
      }
      function id() {}
      const bD = oa("C", void 0, void 0);
      function oa(e, t, n) {
        return { kind: e, value: t, error: n };
      }
      let En = null;
      function ii(e) {
        if (_n.useDeprecatedSynchronousErrorHandling) {
          const t = !En;
          if ((t && (En = { errorThrown: !1, error: null }), e(), t)) {
            const { errorThrown: n, error: r } = En;
            if (((En = null), n)) throw r;
          }
        } else e();
      }
      class ia extends it {
        constructor(t) {
          super(),
            (this.isStopped = !1),
            t
              ? ((this.destination = t), nd(t) && t.add(this))
              : (this.destination = PD);
        }
        static create(t, n, r) {
          return new Gr(t, n, r);
        }
        next(t) {
          this.isStopped
            ? aa(
                (function MD(e) {
                  return oa("N", e, void 0);
                })(t),
                this
              )
            : this._next(t);
        }
        error(t) {
          this.isStopped
            ? aa(
                (function ID(e) {
                  return oa("E", void 0, e);
                })(t),
                this
              )
            : ((this.isStopped = !0), this._error(t));
        }
        complete() {
          this.isStopped
            ? aa(bD, this)
            : ((this.isStopped = !0), this._complete());
        }
        unsubscribe() {
          this.closed ||
            ((this.isStopped = !0),
            super.unsubscribe(),
            (this.destination = null));
        }
        _next(t) {
          this.destination.next(t);
        }
        _error(t) {
          try {
            this.destination.error(t);
          } finally {
            this.unsubscribe();
          }
        }
        _complete() {
          try {
            this.destination.complete();
          } finally {
            this.unsubscribe();
          }
        }
      }
      const AD = Function.prototype.bind;
      function sa(e, t) {
        return AD.call(e, t);
      }
      class RD {
        constructor(t) {
          this.partialObserver = t;
        }
        next(t) {
          const { partialObserver: n } = this;
          if (n.next)
            try {
              n.next(t);
            } catch (r) {
              si(r);
            }
        }
        error(t) {
          const { partialObserver: n } = this;
          if (n.error)
            try {
              n.error(t);
            } catch (r) {
              si(r);
            }
          else si(t);
        }
        complete() {
          const { partialObserver: t } = this;
          if (t.complete)
            try {
              t.complete();
            } catch (n) {
              si(n);
            }
        }
      }
      class Gr extends ia {
        constructor(t, n, r) {
          let o;
          if ((super(), J(t) || !t))
            o = {
              next: t ?? void 0,
              error: n ?? void 0,
              complete: r ?? void 0,
            };
          else {
            let i;
            this && _n.useDeprecatedNextContext
              ? ((i = Object.create(t)),
                (i.unsubscribe = () => this.unsubscribe()),
                (o = {
                  next: t.next && sa(t.next, i),
                  error: t.error && sa(t.error, i),
                  complete: t.complete && sa(t.complete, i),
                }))
              : (o = t);
          }
          this.destination = new RD(o);
        }
      }
      function si(e) {
        _n.useDeprecatedSynchronousErrorHandling
          ? (function TD(e) {
              _n.useDeprecatedSynchronousErrorHandling &&
                En &&
                ((En.errorThrown = !0), (En.error = e));
            })(e)
          : od(e);
      }
      function aa(e, t) {
        const { onStoppedNotification: n } = _n;
        n && oi.setTimeout(() => n(e, t));
      }
      const PD = {
          closed: !0,
          next: id,
          error: function xD(e) {
            throw e;
          },
          complete: id,
        },
        ua =
          ("function" == typeof Symbol && Symbol.observable) || "@@observable";
      function Sn(e) {
        return e;
      }
      function sd(e) {
        return 0 === e.length
          ? Sn
          : 1 === e.length
          ? e[0]
          : function (n) {
              return e.reduce((r, o) => o(r), n);
            };
      }
      let ve = (() => {
        class e {
          constructor(n) {
            n && (this._subscribe = n);
          }
          lift(n) {
            const r = new e();
            return (r.source = this), (r.operator = n), r;
          }
          subscribe(n, r, o) {
            const i = (function FD(e) {
              return (
                (e && e instanceof ia) ||
                ((function OD(e) {
                  return e && J(e.next) && J(e.error) && J(e.complete);
                })(e) &&
                  nd(e))
              );
            })(n)
              ? n
              : new Gr(n, r, o);
            return (
              ii(() => {
                const { operator: s, source: a } = this;
                i.add(
                  s
                    ? s.call(i, a)
                    : a
                    ? this._subscribe(i)
                    : this._trySubscribe(i)
                );
              }),
              i
            );
          }
          _trySubscribe(n) {
            try {
              return this._subscribe(n);
            } catch (r) {
              n.error(r);
            }
          }
          forEach(n, r) {
            return new (r = ad(r))((o, i) => {
              const s = new Gr({
                next: (a) => {
                  try {
                    n(a);
                  } catch (u) {
                    i(u), s.unsubscribe();
                  }
                },
                error: i,
                complete: o,
              });
              this.subscribe(s);
            });
          }
          _subscribe(n) {
            var r;
            return null === (r = this.source) || void 0 === r
              ? void 0
              : r.subscribe(n);
          }
          [ua]() {
            return this;
          }
          pipe(...n) {
            return sd(n)(this);
          }
          toPromise(n) {
            return new (n = ad(n))((r, o) => {
              let i;
              this.subscribe(
                (s) => (i = s),
                (s) => o(s),
                () => r(i)
              );
            });
          }
        }
        return (e.create = (t) => new e(t)), e;
      })();
      function ad(e) {
        var t;
        return null !== (t = e ?? _n.Promise) && void 0 !== t ? t : Promise;
      }
      const kD = Hr(
        (e) =>
          function () {
            e(this),
              (this.name = "ObjectUnsubscribedError"),
              (this.message = "object unsubscribed");
          }
      );
      let Vt = (() => {
        class e extends ve {
          constructor() {
            super(),
              (this.closed = !1),
              (this.currentObservers = null),
              (this.observers = []),
              (this.isStopped = !1),
              (this.hasError = !1),
              (this.thrownError = null);
          }
          lift(n) {
            const r = new ud(this, this);
            return (r.operator = n), r;
          }
          _throwIfClosed() {
            if (this.closed) throw new kD();
          }
          next(n) {
            ii(() => {
              if ((this._throwIfClosed(), !this.isStopped)) {
                this.currentObservers ||
                  (this.currentObservers = Array.from(this.observers));
                for (const r of this.currentObservers) r.next(n);
              }
            });
          }
          error(n) {
            ii(() => {
              if ((this._throwIfClosed(), !this.isStopped)) {
                (this.hasError = this.isStopped = !0), (this.thrownError = n);
                const { observers: r } = this;
                for (; r.length; ) r.shift().error(n);
              }
            });
          }
          complete() {
            ii(() => {
              if ((this._throwIfClosed(), !this.isStopped)) {
                this.isStopped = !0;
                const { observers: n } = this;
                for (; n.length; ) n.shift().complete();
              }
            });
          }
          unsubscribe() {
            (this.isStopped = this.closed = !0),
              (this.observers = this.currentObservers = null);
          }
          get observed() {
            var n;
            return (
              (null === (n = this.observers) || void 0 === n
                ? void 0
                : n.length) > 0
            );
          }
          _trySubscribe(n) {
            return this._throwIfClosed(), super._trySubscribe(n);
          }
          _subscribe(n) {
            return (
              this._throwIfClosed(),
              this._checkFinalizedStatuses(n),
              this._innerSubscribe(n)
            );
          }
          _innerSubscribe(n) {
            const { hasError: r, isStopped: o, observers: i } = this;
            return r || o
              ? td
              : ((this.currentObservers = null),
                i.push(n),
                new it(() => {
                  (this.currentObservers = null), zr(i, n);
                }));
          }
          _checkFinalizedStatuses(n) {
            const { hasError: r, thrownError: o, isStopped: i } = this;
            r ? n.error(o) : i && n.complete();
          }
          asObservable() {
            const n = new ve();
            return (n.source = this), n;
          }
        }
        return (e.create = (t, n) => new ud(t, n)), e;
      })();
      class ud extends Vt {
        constructor(t, n) {
          super(), (this.destination = t), (this.source = n);
        }
        next(t) {
          var n, r;
          null ===
            (r =
              null === (n = this.destination) || void 0 === n
                ? void 0
                : n.next) ||
            void 0 === r ||
            r.call(n, t);
        }
        error(t) {
          var n, r;
          null ===
            (r =
              null === (n = this.destination) || void 0 === n
                ? void 0
                : n.error) ||
            void 0 === r ||
            r.call(n, t);
        }
        complete() {
          var t, n;
          null ===
            (n =
              null === (t = this.destination) || void 0 === t
                ? void 0
                : t.complete) ||
            void 0 === n ||
            n.call(t);
        }
        _subscribe(t) {
          var n, r;
          return null !==
            (r =
              null === (n = this.source) || void 0 === n
                ? void 0
                : n.subscribe(t)) && void 0 !== r
            ? r
            : td;
        }
      }
      function cd(e) {
        return J(e?.lift);
      }
      function Ee(e) {
        return (t) => {
          if (cd(t))
            return t.lift(function (n) {
              try {
                return e(n, this);
              } catch (r) {
                this.error(r);
              }
            });
          throw new TypeError("Unable to lift unknown Observable type");
        };
      }
      function Se(e, t, n, r, o) {
        return new LD(e, t, n, r, o);
      }
      class LD extends ia {
        constructor(t, n, r, o, i, s) {
          super(t),
            (this.onFinalize = i),
            (this.shouldUnsubscribe = s),
            (this._next = n
              ? function (a) {
                  try {
                    n(a);
                  } catch (u) {
                    t.error(u);
                  }
                }
              : super._next),
            (this._error = o
              ? function (a) {
                  try {
                    o(a);
                  } catch (u) {
                    t.error(u);
                  } finally {
                    this.unsubscribe();
                  }
                }
              : super._error),
            (this._complete = r
              ? function () {
                  try {
                    r();
                  } catch (a) {
                    t.error(a);
                  } finally {
                    this.unsubscribe();
                  }
                }
              : super._complete);
        }
        unsubscribe() {
          var t;
          if (!this.shouldUnsubscribe || this.shouldUnsubscribe()) {
            const { closed: n } = this;
            super.unsubscribe(),
              !n &&
                (null === (t = this.onFinalize) ||
                  void 0 === t ||
                  t.call(this));
          }
        }
      }
      function G(e, t) {
        return Ee((n, r) => {
          let o = 0;
          n.subscribe(
            Se(r, (i) => {
              r.next(e.call(t, i, o++));
            })
          );
        });
      }
      function sn(e) {
        return this instanceof sn ? ((this.v = e), this) : new sn(e);
      }
      function hd(e) {
        if (!Symbol.asyncIterator)
          throw new TypeError("Symbol.asyncIterator is not defined.");
        var n,
          t = e[Symbol.asyncIterator];
        return t
          ? t.call(e)
          : ((e = (function fa(e) {
              var t = "function" == typeof Symbol && Symbol.iterator,
                n = t && e[t],
                r = 0;
              if (n) return n.call(e);
              if (e && "number" == typeof e.length)
                return {
                  next: function () {
                    return (
                      e && r >= e.length && (e = void 0),
                      { value: e && e[r++], done: !e }
                    );
                  },
                };
              throw new TypeError(
                t
                  ? "Object is not iterable."
                  : "Symbol.iterator is not defined."
              );
            })(e)),
            (n = {}),
            r("next"),
            r("throw"),
            r("return"),
            (n[Symbol.asyncIterator] = function () {
              return this;
            }),
            n);
        function r(i) {
          n[i] =
            e[i] &&
            function (s) {
              return new Promise(function (a, u) {
                !(function o(i, s, a, u) {
                  Promise.resolve(u).then(function (c) {
                    i({ value: c, done: a });
                  }, s);
                })(a, u, (s = e[i](s)).done, s.value);
              });
            };
        }
      }
      "function" == typeof SuppressedError && SuppressedError;
      const pd = (e) =>
        e && "number" == typeof e.length && "function" != typeof e;
      function gd(e) {
        return J(e?.then);
      }
      function md(e) {
        return J(e[ua]);
      }
      function yd(e) {
        return Symbol.asyncIterator && J(e?.[Symbol.asyncIterator]);
      }
      function vd(e) {
        return new TypeError(
          `You provided ${
            null !== e && "object" == typeof e ? "an invalid object" : `'${e}'`
          } where a stream was expected. You can provide an Observable, Promise, ReadableStream, Array, AsyncIterable, or Iterable.`
        );
      }
      const Dd = (function iw() {
        return "function" == typeof Symbol && Symbol.iterator
          ? Symbol.iterator
          : "@@iterator";
      })();
      function wd(e) {
        return J(e?.[Dd]);
      }
      function Cd(e) {
        return (function fd(e, t, n) {
          if (!Symbol.asyncIterator)
            throw new TypeError("Symbol.asyncIterator is not defined.");
          var o,
            r = n.apply(e, t || []),
            i = [];
          return (
            (o = {}),
            s("next"),
            s("throw"),
            s("return"),
            (o[Symbol.asyncIterator] = function () {
              return this;
            }),
            o
          );
          function s(f) {
            r[f] &&
              (o[f] = function (h) {
                return new Promise(function (p, g) {
                  i.push([f, h, p, g]) > 1 || a(f, h);
                });
              });
          }
          function a(f, h) {
            try {
              !(function u(f) {
                f.value instanceof sn
                  ? Promise.resolve(f.value.v).then(c, l)
                  : d(i[0][2], f);
              })(r[f](h));
            } catch (p) {
              d(i[0][3], p);
            }
          }
          function c(f) {
            a("next", f);
          }
          function l(f) {
            a("throw", f);
          }
          function d(f, h) {
            f(h), i.shift(), i.length && a(i[0][0], i[0][1]);
          }
        })(this, arguments, function* () {
          const n = e.getReader();
          try {
            for (;;) {
              const { value: r, done: o } = yield sn(n.read());
              if (o) return yield sn(void 0);
              yield yield sn(r);
            }
          } finally {
            n.releaseLock();
          }
        });
      }
      function _d(e) {
        return J(e?.getReader);
      }
      function bt(e) {
        if (e instanceof ve) return e;
        if (null != e) {
          if (md(e))
            return (function sw(e) {
              return new ve((t) => {
                const n = e[ua]();
                if (J(n.subscribe)) return n.subscribe(t);
                throw new TypeError(
                  "Provided object does not correctly implement Symbol.observable"
                );
              });
            })(e);
          if (pd(e))
            return (function aw(e) {
              return new ve((t) => {
                for (let n = 0; n < e.length && !t.closed; n++) t.next(e[n]);
                t.complete();
              });
            })(e);
          if (gd(e))
            return (function uw(e) {
              return new ve((t) => {
                e.then(
                  (n) => {
                    t.closed || (t.next(n), t.complete());
                  },
                  (n) => t.error(n)
                ).then(null, od);
              });
            })(e);
          if (yd(e)) return Ed(e);
          if (wd(e))
            return (function cw(e) {
              return new ve((t) => {
                for (const n of e) if ((t.next(n), t.closed)) return;
                t.complete();
              });
            })(e);
          if (_d(e))
            return (function lw(e) {
              return Ed(Cd(e));
            })(e);
        }
        throw vd(e);
      }
      function Ed(e) {
        return new ve((t) => {
          (function dw(e, t) {
            var n, r, o, i;
            return (function ld(e, t, n, r) {
              return new (n || (n = Promise))(function (i, s) {
                function a(l) {
                  try {
                    c(r.next(l));
                  } catch (d) {
                    s(d);
                  }
                }
                function u(l) {
                  try {
                    c(r.throw(l));
                  } catch (d) {
                    s(d);
                  }
                }
                function c(l) {
                  l.done
                    ? i(l.value)
                    : (function o(i) {
                        return i instanceof n
                          ? i
                          : new n(function (s) {
                              s(i);
                            });
                      })(l.value).then(a, u);
                }
                c((r = r.apply(e, t || [])).next());
              });
            })(this, void 0, void 0, function* () {
              try {
                for (n = hd(e); !(r = yield n.next()).done; )
                  if ((t.next(r.value), t.closed)) return;
              } catch (s) {
                o = { error: s };
              } finally {
                try {
                  r && !r.done && (i = n.return) && (yield i.call(n));
                } finally {
                  if (o) throw o.error;
                }
              }
              t.complete();
            });
          })(e, t).catch((n) => t.error(n));
        });
      }
      function Bt(e, t, n, r = 0, o = !1) {
        const i = t.schedule(function () {
          n(), o ? e.add(this.schedule(null, r)) : this.unsubscribe();
        }, r);
        if ((e.add(i), !o)) return i;
      }
      function be(e, t, n = 1 / 0) {
        return J(t)
          ? be((r, o) => G((i, s) => t(r, i, o, s))(bt(e(r, o))), n)
          : ("number" == typeof t && (n = t),
            Ee((r, o) =>
              (function fw(e, t, n, r, o, i, s, a) {
                const u = [];
                let c = 0,
                  l = 0,
                  d = !1;
                const f = () => {
                    d && !u.length && !c && t.complete();
                  },
                  h = (g) => (c < r ? p(g) : u.push(g)),
                  p = (g) => {
                    i && t.next(g), c++;
                    let y = !1;
                    bt(n(g, l++)).subscribe(
                      Se(
                        t,
                        (D) => {
                          o?.(D), i ? h(D) : t.next(D);
                        },
                        () => {
                          y = !0;
                        },
                        void 0,
                        () => {
                          if (y)
                            try {
                              for (c--; u.length && c < r; ) {
                                const D = u.shift();
                                s ? Bt(t, s, () => p(D)) : p(D);
                              }
                              f();
                            } catch (D) {
                              t.error(D);
                            }
                        }
                      )
                    );
                  };
                return (
                  e.subscribe(
                    Se(t, h, () => {
                      (d = !0), f();
                    })
                  ),
                  () => {
                    a?.();
                  }
                );
              })(r, o, e, n)
            ));
      }
      function Wn(e = 1 / 0) {
        return be(Sn, e);
      }
      const It = new ve((e) => e.complete());
      function ha(e) {
        return e[e.length - 1];
      }
      function Wr(e) {
        return (function pw(e) {
          return e && J(e.schedule);
        })(ha(e))
          ? e.pop()
          : void 0;
      }
      function Sd(e, t = 0) {
        return Ee((n, r) => {
          n.subscribe(
            Se(
              r,
              (o) => Bt(r, e, () => r.next(o), t),
              () => Bt(r, e, () => r.complete(), t),
              (o) => Bt(r, e, () => r.error(o), t)
            )
          );
        });
      }
      function bd(e, t = 0) {
        return Ee((n, r) => {
          r.add(e.schedule(() => n.subscribe(r), t));
        });
      }
      function Id(e, t) {
        if (!e) throw new Error("Iterable cannot be null");
        return new ve((n) => {
          Bt(n, t, () => {
            const r = e[Symbol.asyncIterator]();
            Bt(
              n,
              t,
              () => {
                r.next().then((o) => {
                  o.done ? n.complete() : n.next(o.value);
                });
              },
              0,
              !0
            );
          });
        });
      }
      function De(e, t) {
        return t
          ? (function _w(e, t) {
              if (null != e) {
                if (md(e))
                  return (function yw(e, t) {
                    return bt(e).pipe(bd(t), Sd(t));
                  })(e, t);
                if (pd(e))
                  return (function Dw(e, t) {
                    return new ve((n) => {
                      let r = 0;
                      return t.schedule(function () {
                        r === e.length
                          ? n.complete()
                          : (n.next(e[r++]), n.closed || this.schedule());
                      });
                    });
                  })(e, t);
                if (gd(e))
                  return (function vw(e, t) {
                    return bt(e).pipe(bd(t), Sd(t));
                  })(e, t);
                if (yd(e)) return Id(e, t);
                if (wd(e))
                  return (function ww(e, t) {
                    return new ve((n) => {
                      let r;
                      return (
                        Bt(n, t, () => {
                          (r = e[Dd]()),
                            Bt(
                              n,
                              t,
                              () => {
                                let o, i;
                                try {
                                  ({ value: o, done: i } = r.next());
                                } catch (s) {
                                  return void n.error(s);
                                }
                                i ? n.complete() : n.next(o);
                              },
                              0,
                              !0
                            );
                        }),
                        () => J(r?.return) && r.return()
                      );
                    });
                  })(e, t);
                if (_d(e))
                  return (function Cw(e, t) {
                    return Id(Cd(e), t);
                  })(e, t);
              }
              throw vd(e);
            })(e, t)
          : bt(e);
      }
      function pa(e, t, ...n) {
        if (!0 === t) return void e();
        if (!1 === t) return;
        const r = new Gr({
          next: () => {
            r.unsubscribe(), e();
          },
        });
        return t(...n).subscribe(r);
      }
      function X(e) {
        for (let t in e) if (e[t] === X) return t;
        throw Error("Could not find renamed property on target object.");
      }
      function ee(e) {
        if ("string" == typeof e) return e;
        if (Array.isArray(e)) return "[" + e.map(ee).join(", ") + "]";
        if (null == e) return "" + e;
        if (e.overriddenName) return `${e.overriddenName}`;
        if (e.name) return `${e.name}`;
        const t = e.toString();
        if (null == t) return "" + t;
        const n = t.indexOf("\n");
        return -1 === n ? t : t.substring(0, n);
      }
      function ma(e, t) {
        return null == e || "" === e
          ? null === t
            ? ""
            : t
          : null == t || "" === t
          ? e
          : e + " " + t;
      }
      const bw = X({ __forward_ref__: X });
      function ya(e) {
        return (
          (e.__forward_ref__ = ya),
          (e.toString = function () {
            return ee(this());
          }),
          e
        );
      }
      function A(e) {
        return va(e) ? e() : e;
      }
      function va(e) {
        return (
          "function" == typeof e &&
          e.hasOwnProperty(bw) &&
          e.__forward_ref__ === ya
        );
      }
      function Da(e) {
        return e && !!e.ɵproviders;
      }
      const Md = "https://g.co/ng/security#xss";
      class w extends Error {
        constructor(t, n) {
          super(ai(t, n)), (this.code = t);
        }
      }
      function ai(e, t) {
        return `NG0${Math.abs(e)}${t ? ": " + t.trim() : ""}`;
      }
      function F(e) {
        return "string" == typeof e ? e : null == e ? "" : String(e);
      }
      function ui(e, t) {
        throw new w(-201, !1);
      }
      function st(e, t) {
        null == e &&
          (function Y(e, t, n, r) {
            throw new Error(
              `ASSERTION ERROR: ${e}` +
                (null == r ? "" : ` [Expected=> ${n} ${r} ${t} <=Actual]`)
            );
          })(t, e, null, "!=");
      }
      function P(e) {
        return {
          token: e.token,
          providedIn: e.providedIn || null,
          factory: e.factory,
          value: void 0,
        };
      }
      function un(e) {
        return { providers: e.providers || [], imports: e.imports || [] };
      }
      function ci(e) {
        return Td(e, li) || Td(e, Rd);
      }
      function Td(e, t) {
        return e.hasOwnProperty(t) ? e[t] : null;
      }
      function Ad(e) {
        return e && (e.hasOwnProperty(wa) || e.hasOwnProperty(Nw))
          ? e[wa]
          : null;
      }
      const li = X({ ɵprov: X }),
        wa = X({ ɵinj: X }),
        Rd = X({ ngInjectableDef: X }),
        Nw = X({ ngInjectorDef: X });
      var R = (() => (
        ((R = R || {})[(R.Default = 0)] = "Default"),
        (R[(R.Host = 1)] = "Host"),
        (R[(R.Self = 2)] = "Self"),
        (R[(R.SkipSelf = 4)] = "SkipSelf"),
        (R[(R.Optional = 8)] = "Optional"),
        R
      ))();
      let Ca;
      function at(e) {
        const t = Ca;
        return (Ca = e), t;
      }
      function xd(e, t, n) {
        const r = ci(e);
        return r && "root" == r.providedIn
          ? void 0 === r.value
            ? (r.value = r.factory())
            : r.value
          : n & R.Optional
          ? null
          : void 0 !== t
          ? t
          : void ui(ee(e));
      }
      const ne = (() =>
          (typeof globalThis < "u" && globalThis) ||
          (typeof global < "u" && global) ||
          (typeof window < "u" && window) ||
          (typeof self < "u" &&
            typeof WorkerGlobalScope < "u" &&
            self instanceof WorkerGlobalScope &&
            self))(),
        qr = {},
        _a = "__NG_DI_FLAG__",
        di = "ngTempTokenPath",
        Fw = "ngTokenPath",
        kw = /\n/gm,
        Lw = "\u0275",
        Pd = "__source";
      let Zr;
      function qn(e) {
        const t = Zr;
        return (Zr = e), t;
      }
      function jw(e, t = R.Default) {
        if (void 0 === Zr) throw new w(-203, !1);
        return null === Zr
          ? xd(e, void 0, t)
          : Zr.get(e, t & R.Optional ? null : void 0, t);
      }
      function x(e, t = R.Default) {
        return (
          (function Ow() {
            return Ca;
          })() || jw
        )(A(e), t);
      }
      function H(e, t = R.Default) {
        return x(e, fi(t));
      }
      function fi(e) {
        return typeof e > "u" || "number" == typeof e
          ? e
          : 0 |
              (e.optional && 8) |
              (e.host && 1) |
              (e.self && 2) |
              (e.skipSelf && 4);
      }
      function Ea(e) {
        const t = [];
        for (let n = 0; n < e.length; n++) {
          const r = A(e[n]);
          if (Array.isArray(r)) {
            if (0 === r.length) throw new w(900, !1);
            let o,
              i = R.Default;
            for (let s = 0; s < r.length; s++) {
              const a = r[s],
                u = $w(a);
              "number" == typeof u
                ? -1 === u
                  ? (o = a.token)
                  : (i |= u)
                : (o = a);
            }
            t.push(x(o, i));
          } else t.push(x(r));
        }
        return t;
      }
      function Qr(e, t) {
        return (e[_a] = t), (e.prototype[_a] = t), e;
      }
      function $w(e) {
        return e[_a];
      }
      function Ut(e) {
        return { toString: e }.toString();
      }
      var Mt = (() => (
          ((Mt = Mt || {})[(Mt.OnPush = 0)] = "OnPush"),
          (Mt[(Mt.Default = 1)] = "Default"),
          Mt
        ))(),
        Tt = (() => {
          return (
            ((e = Tt || (Tt = {}))[(e.Emulated = 0)] = "Emulated"),
            (e[(e.None = 2)] = "None"),
            (e[(e.ShadowDom = 3)] = "ShadowDom"),
            Tt
          );
          var e;
        })();
      const Ht = {},
        q = [],
        hi = X({ ɵcmp: X }),
        Sa = X({ ɵdir: X }),
        ba = X({ ɵpipe: X }),
        Od = X({ ɵmod: X }),
        zt = X({ ɵfac: X }),
        Yr = X({ __NG_ELEMENT_ID__: X });
      let Uw = 0;
      function Kr(e) {
        return Ut(() => {
          const t = kd(e),
            n = {
              ...t,
              decls: e.decls,
              vars: e.vars,
              template: e.template,
              consts: e.consts || null,
              ngContentSelectors: e.ngContentSelectors,
              onPush: e.changeDetection === Mt.OnPush,
              directiveDefs: null,
              pipeDefs: null,
              dependencies: (t.standalone && e.dependencies) || null,
              getStandaloneInjector: null,
              data: e.data || {},
              encapsulation: e.encapsulation || Tt.Emulated,
              id: "c" + Uw++,
              styles: e.styles || q,
              _: null,
              schemas: e.schemas || null,
              tView: null,
            };
          Ld(n);
          const r = e.dependencies;
          return (n.directiveDefs = pi(r, !1)), (n.pipeDefs = pi(r, !0)), n;
        });
      }
      function zw(e) {
        return K(e) || Re(e);
      }
      function Gw(e) {
        return null !== e;
      }
      function bn(e) {
        return Ut(() => ({
          type: e.type,
          bootstrap: e.bootstrap || q,
          declarations: e.declarations || q,
          imports: e.imports || q,
          exports: e.exports || q,
          transitiveCompileScopes: null,
          schemas: e.schemas || null,
          id: e.id || null,
        }));
      }
      function Fd(e, t) {
        if (null == e) return Ht;
        const n = {};
        for (const r in e)
          if (e.hasOwnProperty(r)) {
            let o = e[r],
              i = o;
            Array.isArray(o) && ((i = o[1]), (o = o[0])),
              (n[o] = r),
              t && (t[o] = i);
          }
        return n;
      }
      function ke(e) {
        return Ut(() => {
          const t = kd(e);
          return Ld(t), t;
        });
      }
      function K(e) {
        return e[hi] || null;
      }
      function Re(e) {
        return e[Sa] || null;
      }
      function Ge(e) {
        return e[ba] || null;
      }
      function Je(e, t) {
        const n = e[Od] || null;
        if (!n && !0 === t)
          throw new Error(`Type ${ee(e)} does not have '\u0275mod' property.`);
        return n;
      }
      function kd(e) {
        const t = {};
        return {
          type: e.type,
          providersResolver: null,
          factory: null,
          hostBindings: e.hostBindings || null,
          hostVars: e.hostVars || 0,
          hostAttrs: e.hostAttrs || null,
          contentQueries: e.contentQueries || null,
          declaredInputs: t,
          exportAs: e.exportAs || null,
          standalone: !0 === e.standalone,
          selectors: e.selectors || q,
          viewQuery: e.viewQuery || null,
          features: e.features || null,
          setInput: null,
          findHostDirectiveDefs: null,
          hostDirectives: null,
          inputs: Fd(e.inputs, t),
          outputs: Fd(e.outputs),
        };
      }
      function Ld(e) {
        e.features?.forEach((t) => t(e));
      }
      function pi(e, t) {
        if (!e) return null;
        const n = t ? Ge : zw;
        return () =>
          ("function" == typeof e ? e() : e).map((r) => n(r)).filter(Gw);
      }
      const Gt = 0,
        E = 1,
        $ = 2,
        ae = 3,
        pt = 4,
        In = 5,
        xe = 6,
        Qn = 7,
        ce = 8,
        gi = 9,
        mi = 10,
        B = 11,
        Ia = 12,
        Xr = 13,
        jd = 14,
        Yn = 15,
        Pe = 16,
        Jr = 17,
        Kn = 18,
        At = 19,
        eo = 20,
        $d = 21,
        re = 22,
        Ma = 1,
        Vd = 2,
        yi = 7,
        vi = 8,
        Xn = 9,
        Le = 10;
      function et(e) {
        return Array.isArray(e) && "object" == typeof e[Ma];
      }
      function gt(e) {
        return Array.isArray(e) && !0 === e[Ma];
      }
      function Ta(e) {
        return 0 != (4 & e.flags);
      }
      function to(e) {
        return e.componentOffset > -1;
      }
      function Di(e) {
        return 1 == (1 & e.flags);
      }
      function mt(e) {
        return !!e.template;
      }
      function qw(e) {
        return 0 != (256 & e[$]);
      }
      function Mn(e, t) {
        return e.hasOwnProperty(zt) ? e[zt] : null;
      }
      class Yw {
        constructor(t, n, r) {
          (this.previousValue = t),
            (this.currentValue = n),
            (this.firstChange = r);
        }
        isFirstChange() {
          return this.firstChange;
        }
      }
      function Tn() {
        return Hd;
      }
      function Hd(e) {
        return e.type.prototype.ngOnChanges && (e.setInput = Xw), Kw;
      }
      function Kw() {
        const e = Gd(this),
          t = e?.current;
        if (t) {
          const n = e.previous;
          if (n === Ht) e.previous = t;
          else for (let r in t) n[r] = t[r];
          (e.current = null), this.ngOnChanges(t);
        }
      }
      function Xw(e, t, n, r) {
        const o = this.declaredInputs[n],
          i =
            Gd(e) ||
            (function Jw(e, t) {
              return (e[zd] = t);
            })(e, { previous: Ht, current: null }),
          s = i.current || (i.current = {}),
          a = i.previous,
          u = a[o];
        (s[o] = new Yw(u && u.currentValue, t, a === Ht)), (e[r] = t);
      }
      Tn.ngInherit = !0;
      const zd = "__ngSimpleChanges__";
      function Gd(e) {
        return e[zd] || null;
      }
      const ut = function (e, t, n) {};
      function Ie(e) {
        for (; Array.isArray(e); ) e = e[Gt];
        return e;
      }
      function tt(e, t) {
        return Ie(t[e.index]);
      }
      function Zd(e, t) {
        return e.data[t];
      }
      function We(e, t) {
        const n = t[e];
        return et(n) ? n : n[Gt];
      }
      function Ci(e) {
        return 64 == (64 & e[$]);
      }
      function cn(e, t) {
        return null == t ? null : e[t];
      }
      function Qd(e) {
        e[Kn] = 0;
      }
      function Ra(e, t) {
        e[In] += t;
        let n = e,
          r = e[ae];
        for (
          ;
          null !== r && ((1 === t && 1 === n[In]) || (-1 === t && 0 === n[In]));

        )
          (r[In] += t), (n = r), (r = r[ae]);
      }
      const k = { lFrame: af(null), bindingsEnabled: !0 };
      function Kd() {
        return k.bindingsEnabled;
      }
      function v() {
        return k.lFrame.lView;
      }
      function W() {
        return k.lFrame.tView;
      }
      function xa(e) {
        return (k.lFrame.contextLView = e), e[ce];
      }
      function Pa(e) {
        return (k.lFrame.contextLView = null), e;
      }
      function Me() {
        let e = Xd();
        for (; null !== e && 64 === e.type; ) e = e.parent;
        return e;
      }
      function Xd() {
        return k.lFrame.currentTNode;
      }
      function Rt(e, t) {
        const n = k.lFrame;
        (n.currentTNode = e), (n.isParent = t);
      }
      function Na() {
        return k.lFrame.isParent;
      }
      function er() {
        return k.lFrame.bindingIndex++;
      }
      function fC(e, t) {
        const n = k.lFrame;
        (n.bindingIndex = n.bindingRootIndex = e), Fa(t);
      }
      function Fa(e) {
        k.lFrame.currentDirectiveIndex = e;
      }
      function La(e) {
        k.lFrame.currentQueryIndex = e;
      }
      function pC(e) {
        const t = e[E];
        return 2 === t.type ? t.declTNode : 1 === t.type ? e[xe] : null;
      }
      function rf(e, t, n) {
        if (n & R.SkipSelf) {
          let o = t,
            i = e;
          for (
            ;
            !((o = o.parent),
            null !== o ||
              n & R.Host ||
              ((o = pC(i)), null === o || ((i = i[Yn]), 10 & o.type)));

          );
          if (null === o) return !1;
          (t = o), (e = i);
        }
        const r = (k.lFrame = sf());
        return (r.currentTNode = t), (r.lView = e), !0;
      }
      function ja(e) {
        const t = sf(),
          n = e[E];
        (k.lFrame = t),
          (t.currentTNode = n.firstChild),
          (t.lView = e),
          (t.tView = n),
          (t.contextLView = e),
          (t.bindingIndex = n.bindingStartIndex),
          (t.inI18n = !1);
      }
      function sf() {
        const e = k.lFrame,
          t = null === e ? null : e.child;
        return null === t ? af(e) : t;
      }
      function af(e) {
        const t = {
          currentTNode: null,
          isParent: !0,
          lView: null,
          tView: null,
          selectedIndex: -1,
          contextLView: null,
          elementDepthCount: 0,
          currentNamespace: null,
          currentDirectiveIndex: -1,
          bindingRootIndex: -1,
          bindingIndex: -1,
          currentQueryIndex: 0,
          parent: e,
          child: null,
          inI18n: !1,
        };
        return null !== e && (e.child = t), t;
      }
      function uf() {
        const e = k.lFrame;
        return (
          (k.lFrame = e.parent), (e.currentTNode = null), (e.lView = null), e
        );
      }
      const cf = uf;
      function $a() {
        const e = uf();
        (e.isParent = !0),
          (e.tView = null),
          (e.selectedIndex = -1),
          (e.contextLView = null),
          (e.elementDepthCount = 0),
          (e.currentDirectiveIndex = -1),
          (e.currentNamespace = null),
          (e.bindingRootIndex = -1),
          (e.bindingIndex = -1),
          (e.currentQueryIndex = 0);
      }
      function $e() {
        return k.lFrame.selectedIndex;
      }
      function An(e) {
        k.lFrame.selectedIndex = e;
      }
      function oe() {
        const e = k.lFrame;
        return Zd(e.tView, e.selectedIndex);
      }
      function _i(e, t) {
        for (let n = t.directiveStart, r = t.directiveEnd; n < r; n++) {
          const i = e.data[n].type.prototype,
            {
              ngAfterContentInit: s,
              ngAfterContentChecked: a,
              ngAfterViewInit: u,
              ngAfterViewChecked: c,
              ngOnDestroy: l,
            } = i;
          s && (e.contentHooks ?? (e.contentHooks = [])).push(-n, s),
            a &&
              ((e.contentHooks ?? (e.contentHooks = [])).push(n, a),
              (e.contentCheckHooks ?? (e.contentCheckHooks = [])).push(n, a)),
            u && (e.viewHooks ?? (e.viewHooks = [])).push(-n, u),
            c &&
              ((e.viewHooks ?? (e.viewHooks = [])).push(n, c),
              (e.viewCheckHooks ?? (e.viewCheckHooks = [])).push(n, c)),
            null != l && (e.destroyHooks ?? (e.destroyHooks = [])).push(n, l);
        }
      }
      function Ei(e, t, n) {
        lf(e, t, 3, n);
      }
      function Si(e, t, n, r) {
        (3 & e[$]) === n && lf(e, t, n, r);
      }
      function Va(e, t) {
        let n = e[$];
        (3 & n) === t && ((n &= 2047), (n += 1), (e[$] = n));
      }
      function lf(e, t, n, r) {
        const i = r ?? -1,
          s = t.length - 1;
        let a = 0;
        for (let u = void 0 !== r ? 65535 & e[Kn] : 0; u < s; u++)
          if ("number" == typeof t[u + 1]) {
            if (((a = t[u]), null != r && a >= r)) break;
          } else
            t[u] < 0 && (e[Kn] += 65536),
              (a < i || -1 == i) &&
                (EC(e, n, t, u), (e[Kn] = (4294901760 & e[Kn]) + u + 2)),
              u++;
      }
      function EC(e, t, n, r) {
        const o = n[r] < 0,
          i = n[r + 1],
          a = e[o ? -n[r] : n[r]];
        if (o) {
          if (e[$] >> 11 < e[Kn] >> 16 && (3 & e[$]) === t) {
            (e[$] += 2048), ut(4, a, i);
            try {
              i.call(a);
            } finally {
              ut(5, a, i);
            }
          }
        } else {
          ut(4, a, i);
          try {
            i.call(a);
          } finally {
            ut(5, a, i);
          }
        }
      }
      const tr = -1;
      class ro {
        constructor(t, n, r) {
          (this.factory = t),
            (this.resolving = !1),
            (this.canSeeViewProviders = n),
            (this.injectImpl = r);
        }
      }
      function Ua(e, t, n) {
        let r = 0;
        for (; r < n.length; ) {
          const o = n[r];
          if ("number" == typeof o) {
            if (0 !== o) break;
            r++;
            const i = n[r++],
              s = n[r++],
              a = n[r++];
            e.setAttribute(t, s, a, i);
          } else {
            const i = o,
              s = n[++r];
            ff(i) ? e.setProperty(t, i, s) : e.setAttribute(t, i, s), r++;
          }
        }
        return r;
      }
      function df(e) {
        return 3 === e || 4 === e || 6 === e;
      }
      function ff(e) {
        return 64 === e.charCodeAt(0);
      }
      function oo(e, t) {
        if (null !== t && 0 !== t.length)
          if (null === e || 0 === e.length) e = t.slice();
          else {
            let n = -1;
            for (let r = 0; r < t.length; r++) {
              const o = t[r];
              "number" == typeof o
                ? (n = o)
                : 0 === n ||
                  hf(e, n, o, null, -1 === n || 2 === n ? t[++r] : null);
            }
          }
        return e;
      }
      function hf(e, t, n, r, o) {
        let i = 0,
          s = e.length;
        if (-1 === t) s = -1;
        else
          for (; i < e.length; ) {
            const a = e[i++];
            if ("number" == typeof a) {
              if (a === t) {
                s = -1;
                break;
              }
              if (a > t) {
                s = i - 1;
                break;
              }
            }
          }
        for (; i < e.length; ) {
          const a = e[i];
          if ("number" == typeof a) break;
          if (a === n) {
            if (null === r) return void (null !== o && (e[i + 1] = o));
            if (r === e[i + 1]) return void (e[i + 2] = o);
          }
          i++, null !== r && i++, null !== o && i++;
        }
        -1 !== s && (e.splice(s, 0, t), (i = s + 1)),
          e.splice(i++, 0, n),
          null !== r && e.splice(i++, 0, r),
          null !== o && e.splice(i++, 0, o);
      }
      function pf(e) {
        return e !== tr;
      }
      function bi(e) {
        return 32767 & e;
      }
      function Ii(e, t) {
        let n = (function MC(e) {
            return e >> 16;
          })(e),
          r = t;
        for (; n > 0; ) (r = r[Yn]), n--;
        return r;
      }
      let Ha = !0;
      function Mi(e) {
        const t = Ha;
        return (Ha = e), t;
      }
      const gf = 255,
        mf = 5;
      let TC = 0;
      const xt = {};
      function Ti(e, t) {
        const n = yf(e, t);
        if (-1 !== n) return n;
        const r = t[E];
        r.firstCreatePass &&
          ((e.injectorIndex = t.length),
          za(r.data, e),
          za(t, null),
          za(r.blueprint, null));
        const o = Ga(e, t),
          i = e.injectorIndex;
        if (pf(o)) {
          const s = bi(o),
            a = Ii(o, t),
            u = a[E].data;
          for (let c = 0; c < 8; c++) t[i + c] = a[s + c] | u[s + c];
        }
        return (t[i + 8] = o), i;
      }
      function za(e, t) {
        e.push(0, 0, 0, 0, 0, 0, 0, 0, t);
      }
      function yf(e, t) {
        return -1 === e.injectorIndex ||
          (e.parent && e.parent.injectorIndex === e.injectorIndex) ||
          null === t[e.injectorIndex + 8]
          ? -1
          : e.injectorIndex;
      }
      function Ga(e, t) {
        if (e.parent && -1 !== e.parent.injectorIndex)
          return e.parent.injectorIndex;
        let n = 0,
          r = null,
          o = t;
        for (; null !== o; ) {
          if (((r = bf(o)), null === r)) return tr;
          if ((n++, (o = o[Yn]), -1 !== r.injectorIndex))
            return r.injectorIndex | (n << 16);
        }
        return tr;
      }
      function Wa(e, t, n) {
        !(function AC(e, t, n) {
          let r;
          "string" == typeof n
            ? (r = n.charCodeAt(0) || 0)
            : n.hasOwnProperty(Yr) && (r = n[Yr]),
            null == r && (r = n[Yr] = TC++);
          const o = r & gf;
          t.data[e + (o >> mf)] |= 1 << o;
        })(e, t, n);
      }
      function vf(e, t, n) {
        if (n & R.Optional || void 0 !== e) return e;
        ui();
      }
      function Df(e, t, n, r) {
        if (
          (n & R.Optional && void 0 === r && (r = null),
          !(n & (R.Self | R.Host)))
        ) {
          const o = e[gi],
            i = at(void 0);
          try {
            return o ? o.get(t, r, n & R.Optional) : xd(t, r, n & R.Optional);
          } finally {
            at(i);
          }
        }
        return vf(r, 0, n);
      }
      function wf(e, t, n, r = R.Default, o) {
        if (null !== e) {
          if (1024 & t[$]) {
            const s = (function OC(e, t, n, r, o) {
              let i = e,
                s = t;
              for (
                ;
                null !== i && null !== s && 1024 & s[$] && !(256 & s[$]);

              ) {
                const a = Cf(i, s, n, r | R.Self, xt);
                if (a !== xt) return a;
                let u = i.parent;
                if (!u) {
                  const c = s[$d];
                  if (c) {
                    const l = c.get(n, xt, r);
                    if (l !== xt) return l;
                  }
                  (u = bf(s)), (s = s[Yn]);
                }
                i = u;
              }
              return o;
            })(e, t, n, r, xt);
            if (s !== xt) return s;
          }
          const i = Cf(e, t, n, r, xt);
          if (i !== xt) return i;
        }
        return Df(t, n, r, o);
      }
      function Cf(e, t, n, r, o) {
        const i = (function PC(e) {
          if ("string" == typeof e) return e.charCodeAt(0) || 0;
          const t = e.hasOwnProperty(Yr) ? e[Yr] : void 0;
          return "number" == typeof t ? (t >= 0 ? t & gf : NC) : t;
        })(n);
        if ("function" == typeof i) {
          if (!rf(t, e, r)) return r & R.Host ? vf(o, 0, r) : Df(t, n, r, o);
          try {
            const s = i(r);
            if (null != s || r & R.Optional) return s;
            ui();
          } finally {
            cf();
          }
        } else if ("number" == typeof i) {
          let s = null,
            a = yf(e, t),
            u = tr,
            c = r & R.Host ? t[Pe][xe] : null;
          for (
            (-1 === a || r & R.SkipSelf) &&
            ((u = -1 === a ? Ga(e, t) : t[a + 8]),
            u !== tr && Ef(r, !1)
              ? ((s = t[E]), (a = bi(u)), (t = Ii(u, t)))
              : (a = -1));
            -1 !== a;

          ) {
            const l = t[E];
            if (_f(i, a, l.data)) {
              const d = xC(a, t, n, s, r, c);
              if (d !== xt) return d;
            }
            (u = t[a + 8]),
              u !== tr && Ef(r, t[E].data[a + 8] === c) && _f(i, a, t)
                ? ((s = l), (a = bi(u)), (t = Ii(u, t)))
                : (a = -1);
          }
        }
        return o;
      }
      function xC(e, t, n, r, o, i) {
        const s = t[E],
          a = s.data[e + 8],
          l = (function Ai(e, t, n, r, o) {
            const i = e.providerIndexes,
              s = t.data,
              a = 1048575 & i,
              u = e.directiveStart,
              l = i >> 20,
              f = o ? a + l : e.directiveEnd;
            for (let h = r ? a : a + l; h < f; h++) {
              const p = s[h];
              if ((h < u && n === p) || (h >= u && p.type === n)) return h;
            }
            if (o) {
              const h = s[u];
              if (h && mt(h) && h.type === n) return u;
            }
            return null;
          })(
            a,
            s,
            n,
            null == r ? to(a) && Ha : r != s && 0 != (3 & a.type),
            o & R.Host && i === a
          );
        return null !== l ? Rn(t, s, l, a) : xt;
      }
      function Rn(e, t, n, r) {
        let o = e[n];
        const i = t.data;
        if (
          (function SC(e) {
            return e instanceof ro;
          })(o)
        ) {
          const s = o;
          s.resolving &&
            (function Iw(e, t) {
              const n = t ? `. Dependency path: ${t.join(" > ")} > ${e}` : "";
              throw new w(
                -200,
                `Circular dependency in DI detected for ${e}${n}`
              );
            })(
              (function Q(e) {
                return "function" == typeof e
                  ? e.name || e.toString()
                  : "object" == typeof e &&
                    null != e &&
                    "function" == typeof e.type
                  ? e.type.name || e.type.toString()
                  : F(e);
              })(i[n])
            );
          const a = Mi(s.canSeeViewProviders);
          s.resolving = !0;
          const u = s.injectImpl ? at(s.injectImpl) : null;
          rf(e, r, R.Default);
          try {
            (o = e[n] = s.factory(void 0, i, e, r)),
              t.firstCreatePass &&
                n >= r.directiveStart &&
                (function _C(e, t, n) {
                  const {
                    ngOnChanges: r,
                    ngOnInit: o,
                    ngDoCheck: i,
                  } = t.type.prototype;
                  if (r) {
                    const s = Hd(t);
                    (n.preOrderHooks ?? (n.preOrderHooks = [])).push(e, s),
                      (
                        n.preOrderCheckHooks ?? (n.preOrderCheckHooks = [])
                      ).push(e, s);
                  }
                  o &&
                    (n.preOrderHooks ?? (n.preOrderHooks = [])).push(0 - e, o),
                    i &&
                      ((n.preOrderHooks ?? (n.preOrderHooks = [])).push(e, i),
                      (
                        n.preOrderCheckHooks ?? (n.preOrderCheckHooks = [])
                      ).push(e, i));
                })(n, i[n], t);
          } finally {
            null !== u && at(u), Mi(a), (s.resolving = !1), cf();
          }
        }
        return o;
      }
      function _f(e, t, n) {
        return !!(n[t + (e >> mf)] & (1 << e));
      }
      function Ef(e, t) {
        return !(e & R.Self || (e & R.Host && t));
      }
      class nr {
        constructor(t, n) {
          (this._tNode = t), (this._lView = n);
        }
        get(t, n, r) {
          return wf(this._tNode, this._lView, t, fi(r), n);
        }
      }
      function NC() {
        return new nr(Me(), v());
      }
      function qa(e) {
        return va(e)
          ? () => {
              const t = qa(A(e));
              return t && t();
            }
          : Mn(e);
      }
      function bf(e) {
        const t = e[E],
          n = t.type;
        return 2 === n ? t.declTNode : 1 === n ? e[xe] : null;
      }
      const or = "__parameters__";
      function sr(e, t, n) {
        return Ut(() => {
          const r = (function Za(e) {
            return function (...n) {
              if (e) {
                const r = e(...n);
                for (const o in r) this[o] = r[o];
              }
            };
          })(t);
          function o(...i) {
            if (this instanceof o) return r.apply(this, i), this;
            const s = new o(...i);
            return (a.annotation = s), a;
            function a(u, c, l) {
              const d = u.hasOwnProperty(or)
                ? u[or]
                : Object.defineProperty(u, or, { value: [] })[or];
              for (; d.length <= l; ) d.push(null);
              return (d[l] = d[l] || []).push(s), u;
            }
          }
          return (
            n && (o.prototype = Object.create(n.prototype)),
            (o.prototype.ngMetadataName = e),
            (o.annotationCls = o),
            o
          );
        });
      }
      class N {
        constructor(t, n) {
          (this._desc = t),
            (this.ngMetadataName = "InjectionToken"),
            (this.ɵprov = void 0),
            "number" == typeof n
              ? (this.__NG_ELEMENT_ID__ = n)
              : void 0 !== n &&
                (this.ɵprov = P({
                  token: this,
                  providedIn: n.providedIn || "root",
                  factory: n.factory,
                }));
        }
        get multi() {
          return this;
        }
        toString() {
          return `InjectionToken ${this._desc}`;
        }
      }
      function xn(e, t) {
        e.forEach((n) => (Array.isArray(n) ? xn(n, t) : t(n)));
      }
      function Mf(e, t, n) {
        t >= e.length ? e.push(n) : e.splice(t, 0, n);
      }
      function xi(e, t) {
        return t >= e.length - 1 ? e.pop() : e.splice(t, 1)[0];
      }
      const uo = Qr(sr("Optional"), 8),
        co = Qr(sr("SkipSelf"), 4);
      var qe = (() => (
        ((qe = qe || {})[(qe.Important = 1)] = "Important"),
        (qe[(qe.DashCase = 2)] = "DashCase"),
        qe
      ))();
      const nu = new Map();
      let s_ = 0;
      const ou = "__ngContext__";
      function Ne(e, t) {
        et(t)
          ? ((e[ou] = t[eo]),
            (function u_(e) {
              nu.set(e[eo], e);
            })(t))
          : (e[ou] = t);
      }
      let iu;
      function su(e, t) {
        return iu(e, t);
      }
      function po(e) {
        const t = e[ae];
        return gt(t) ? t[ae] : t;
      }
      function au(e) {
        return Zf(e[Xr]);
      }
      function uu(e) {
        return Zf(e[pt]);
      }
      function Zf(e) {
        for (; null !== e && !gt(e); ) e = e[pt];
        return e;
      }
      function cr(e, t, n, r, o) {
        if (null != r) {
          let i,
            s = !1;
          gt(r) ? (i = r) : et(r) && ((s = !0), (r = r[Gt]));
          const a = Ie(r);
          0 === e && null !== n
            ? null == o
              ? eh(t, n, a)
              : Pn(t, n, a, o || null, !0)
            : 1 === e && null !== n
            ? Pn(t, n, a, o || null, !0)
            : 2 === e
            ? (function gu(e, t, n) {
                const r = Fi(e, t);
                r &&
                  (function T_(e, t, n, r) {
                    e.removeChild(t, n, r);
                  })(e, r, t, n);
              })(t, a, s)
            : 3 === e && t.destroyNode(a),
            null != i &&
              (function x_(e, t, n, r, o) {
                const i = n[yi];
                i !== Ie(n) && cr(t, e, r, i, o);
                for (let a = Le; a < n.length; a++) {
                  const u = n[a];
                  go(u[E], u, e, t, r, i);
                }
              })(t, e, i, n, o);
        }
      }
      function lu(e, t, n) {
        return e.createElement(t, n);
      }
      function Yf(e, t) {
        const n = e[Xn],
          r = n.indexOf(t),
          o = t[ae];
        512 & t[$] && ((t[$] &= -513), Ra(o, -1)), n.splice(r, 1);
      }
      function du(e, t) {
        if (e.length <= Le) return;
        const n = Le + t,
          r = e[n];
        if (r) {
          const o = r[Jr];
          null !== o && o !== e && Yf(o, r), t > 0 && (e[n - 1][pt] = r[pt]);
          const i = xi(e, Le + t);
          !(function w_(e, t) {
            go(e, t, t[B], 2, null, null), (t[Gt] = null), (t[xe] = null);
          })(r[E], r);
          const s = i[At];
          null !== s && s.detachView(i[E]),
            (r[ae] = null),
            (r[pt] = null),
            (r[$] &= -65);
        }
        return r;
      }
      function Kf(e, t) {
        if (!(128 & t[$])) {
          const n = t[B];
          n.destroyNode && go(e, t, n, 3, null, null),
            (function E_(e) {
              let t = e[Xr];
              if (!t) return fu(e[E], e);
              for (; t; ) {
                let n = null;
                if (et(t)) n = t[Xr];
                else {
                  const r = t[Le];
                  r && (n = r);
                }
                if (!n) {
                  for (; t && !t[pt] && t !== e; )
                    et(t) && fu(t[E], t), (t = t[ae]);
                  null === t && (t = e), et(t) && fu(t[E], t), (n = t && t[pt]);
                }
                t = n;
              }
            })(t);
        }
      }
      function fu(e, t) {
        if (!(128 & t[$])) {
          (t[$] &= -65),
            (t[$] |= 128),
            (function M_(e, t) {
              let n;
              if (null != e && null != (n = e.destroyHooks))
                for (let r = 0; r < n.length; r += 2) {
                  const o = t[n[r]];
                  if (!(o instanceof ro)) {
                    const i = n[r + 1];
                    if (Array.isArray(i))
                      for (let s = 0; s < i.length; s += 2) {
                        const a = o[i[s]],
                          u = i[s + 1];
                        ut(4, a, u);
                        try {
                          u.call(a);
                        } finally {
                          ut(5, a, u);
                        }
                      }
                    else {
                      ut(4, o, i);
                      try {
                        i.call(o);
                      } finally {
                        ut(5, o, i);
                      }
                    }
                  }
                }
            })(e, t),
            (function I_(e, t) {
              const n = e.cleanup,
                r = t[Qn];
              let o = -1;
              if (null !== n)
                for (let i = 0; i < n.length - 1; i += 2)
                  if ("string" == typeof n[i]) {
                    const s = n[i + 3];
                    s >= 0 ? r[(o = s)]() : r[(o = -s)].unsubscribe(), (i += 2);
                  } else {
                    const s = r[(o = n[i + 1])];
                    n[i].call(s);
                  }
              if (null !== r) {
                for (let i = o + 1; i < r.length; i++) (0, r[i])();
                t[Qn] = null;
              }
            })(e, t),
            1 === t[E].type && t[B].destroy();
          const n = t[Jr];
          if (null !== n && gt(t[ae])) {
            n !== t[ae] && Yf(n, t);
            const r = t[At];
            null !== r && r.detachView(e);
          }
          !(function c_(e) {
            nu.delete(e[eo]);
          })(t);
        }
      }
      function Xf(e, t, n) {
        return (function Jf(e, t, n) {
          let r = t;
          for (; null !== r && 40 & r.type; ) r = (t = r).parent;
          if (null === r) return n[Gt];
          {
            const { componentOffset: o } = r;
            if (o > -1) {
              const { encapsulation: i } = e.data[r.directiveStart + o];
              if (i === Tt.None || i === Tt.Emulated) return null;
            }
            return tt(r, n);
          }
        })(e, t.parent, n);
      }
      function Pn(e, t, n, r, o) {
        e.insertBefore(t, n, r, o);
      }
      function eh(e, t, n) {
        e.appendChild(t, n);
      }
      function th(e, t, n, r, o) {
        null !== r ? Pn(e, t, n, r, o) : eh(e, t, n);
      }
      function Fi(e, t) {
        return e.parentNode(t);
      }
      let hu,
        vu,
        oh = function rh(e, t, n) {
          return 40 & e.type ? tt(e, n) : null;
        };
      function ki(e, t, n, r) {
        const o = Xf(e, r, t),
          i = t[B],
          a = (function nh(e, t, n) {
            return oh(e, t, n);
          })(r.parent || t[xe], r, t);
        if (null != o)
          if (Array.isArray(n))
            for (let u = 0; u < n.length; u++) th(i, o, n[u], a, !1);
          else th(i, o, n, a, !1);
        void 0 !== hu && hu(i, r, t, n, o);
      }
      function Li(e, t) {
        if (null !== t) {
          const n = t.type;
          if (3 & n) return tt(t, e);
          if (4 & n) return pu(-1, e[t.index]);
          if (8 & n) {
            const r = t.child;
            if (null !== r) return Li(e, r);
            {
              const o = e[t.index];
              return gt(o) ? pu(-1, o) : Ie(o);
            }
          }
          if (32 & n) return su(t, e)() || Ie(e[t.index]);
          {
            const r = sh(e, t);
            return null !== r
              ? Array.isArray(r)
                ? r[0]
                : Li(po(e[Pe]), r)
              : Li(e, t.next);
          }
        }
        return null;
      }
      function sh(e, t) {
        return null !== t ? e[Pe][xe].projection[t.projection] : null;
      }
      function pu(e, t) {
        const n = Le + e + 1;
        if (n < t.length) {
          const r = t[n],
            o = r[E].firstChild;
          if (null !== o) return Li(r, o);
        }
        return t[yi];
      }
      function mu(e, t, n, r, o, i, s) {
        for (; null != n; ) {
          const a = r[n.index],
            u = n.type;
          if (
            (s && 0 === t && (a && Ne(Ie(a), r), (n.flags |= 2)),
            32 != (32 & n.flags))
          )
            if (8 & u) mu(e, t, n.child, r, o, i, !1), cr(t, e, o, a, i);
            else if (32 & u) {
              const c = su(n, r);
              let l;
              for (; (l = c()); ) cr(t, e, o, l, i);
              cr(t, e, o, a, i);
            } else 16 & u ? ah(e, t, r, n, o, i) : cr(t, e, o, a, i);
          n = s ? n.projectionNext : n.next;
        }
      }
      function go(e, t, n, r, o, i) {
        mu(n, r, e.firstChild, t, o, i, !1);
      }
      function ah(e, t, n, r, o, i) {
        const s = n[Pe],
          u = s[xe].projection[r.projection];
        if (Array.isArray(u))
          for (let c = 0; c < u.length; c++) cr(t, e, o, u[c], i);
        else mu(e, t, u, s[ae], o, i, !0);
      }
      function uh(e, t, n) {
        "" === n
          ? e.removeAttribute(t, "class")
          : e.setAttribute(t, "class", n);
      }
      function ch(e, t, n) {
        const { mergedAttrs: r, classes: o, styles: i } = n;
        null !== r && Ua(e, t, r),
          null !== o && uh(e, t, o),
          null !== i &&
            (function N_(e, t, n) {
              e.setAttribute(t, "style", n);
            })(e, t, i);
      }
      class ph {
        constructor(t) {
          this.changingThisBreaksApplicationSecurity = t;
        }
        toString() {
          return `SafeValue must use [property]=binding: ${this.changingThisBreaksApplicationSecurity} (see ${Md})`;
        }
      }
      const q_ = /^(?!javascript:)(?:[a-z0-9+.-]+:|[^&:\/?#]*(?:[\/?#]|$))/i;
      var ge = (() => (
        ((ge = ge || {})[(ge.NONE = 0)] = "NONE"),
        (ge[(ge.HTML = 1)] = "HTML"),
        (ge[(ge.STYLE = 2)] = "STYLE"),
        (ge[(ge.SCRIPT = 3)] = "SCRIPT"),
        (ge[(ge.URL = 4)] = "URL"),
        (ge[(ge.RESOURCE_URL = 5)] = "RESOURCE_URL"),
        ge
      ))();
      function Su(e) {
        const t = (function vo() {
          const e = v();
          return e && e[Ia];
        })();
        return t
          ? t.sanitize(ge.URL, e) || ""
          : (function mo(e, t) {
              const n = (function H_(e) {
                return (e instanceof ph && e.getTypeName()) || null;
              })(e);
              if (null != n && n !== t) {
                if ("ResourceURL" === n && "URL" === t) return !0;
                throw new Error(`Required a safe ${t}, got a ${n} (see ${Md})`);
              }
              return n === t;
            })(e, "URL")
          ? (function ln(e) {
              return e instanceof ph
                ? e.changingThisBreaksApplicationSecurity
                : e;
            })(e)
          : (function wu(e) {
              return (e = String(e)).match(q_) ? e : "unsafe:" + e;
            })(F(e));
      }
      const Bi = new N("ENVIRONMENT_INITIALIZER"),
        Eh = new N("INJECTOR", -1),
        Sh = new N("INJECTOR_DEF_TYPES");
      class bh {
        get(t, n = qr) {
          if (n === qr) {
            const r = new Error(`NullInjectorError: No provider for ${ee(t)}!`);
            throw ((r.name = "NullInjectorError"), r);
          }
          return n;
        }
      }
      function sE(...e) {
        return { ɵproviders: Ih(0, e), ɵfromNgModule: !0 };
      }
      function Ih(e, ...t) {
        const n = [],
          r = new Set();
        let o;
        return (
          xn(t, (i) => {
            const s = i;
            bu(s, n, [], r) && (o || (o = []), o.push(s));
          }),
          void 0 !== o && Mh(o, n),
          n
        );
      }
      function Mh(e, t) {
        for (let n = 0; n < e.length; n++) {
          const { providers: o } = e[n];
          Iu(o, (i) => {
            t.push(i);
          });
        }
      }
      function bu(e, t, n, r) {
        if (!(e = A(e))) return !1;
        let o = null,
          i = Ad(e);
        const s = !i && K(e);
        if (i || s) {
          if (s && !s.standalone) return !1;
          o = e;
        } else {
          const u = e.ngModule;
          if (((i = Ad(u)), !i)) return !1;
          o = u;
        }
        const a = r.has(o);
        if (s) {
          if (a) return !1;
          if ((r.add(o), s.dependencies)) {
            const u =
              "function" == typeof s.dependencies
                ? s.dependencies()
                : s.dependencies;
            for (const c of u) bu(c, t, n, r);
          }
        } else {
          if (!i) return !1;
          {
            if (null != i.imports && !a) {
              let c;
              r.add(o);
              try {
                xn(i.imports, (l) => {
                  bu(l, t, n, r) && (c || (c = []), c.push(l));
                });
              } finally {
              }
              void 0 !== c && Mh(c, t);
            }
            if (!a) {
              const c = Mn(o) || (() => new o());
              t.push(
                { provide: o, useFactory: c, deps: q },
                { provide: Sh, useValue: o, multi: !0 },
                { provide: Bi, useValue: () => x(o), multi: !0 }
              );
            }
            const u = i.providers;
            null == u ||
              a ||
              Iu(u, (l) => {
                t.push(l);
              });
          }
        }
        return o !== e && void 0 !== e.providers;
      }
      function Iu(e, t) {
        for (let n of e)
          Da(n) && (n = n.ɵproviders), Array.isArray(n) ? Iu(n, t) : t(n);
      }
      const aE = X({ provide: String, useValue: X });
      function Mu(e) {
        return null !== e && "object" == typeof e && aE in e;
      }
      function Nn(e) {
        return "function" == typeof e;
      }
      const Tu = new N("Set Injector scope."),
        Ui = {},
        cE = {};
      let Au;
      function Hi() {
        return void 0 === Au && (Au = new bh()), Au;
      }
      class Qt {}
      class Rh extends Qt {
        get destroyed() {
          return this._destroyed;
        }
        constructor(t, n, r, o) {
          super(),
            (this.parent = n),
            (this.source = r),
            (this.scopes = o),
            (this.records = new Map()),
            (this._ngOnDestroyHooks = new Set()),
            (this._onDestroyHooks = []),
            (this._destroyed = !1),
            xu(t, (s) => this.processProvider(s)),
            this.records.set(Eh, dr(void 0, this)),
            o.has("environment") && this.records.set(Qt, dr(void 0, this));
          const i = this.records.get(Tu);
          null != i && "string" == typeof i.value && this.scopes.add(i.value),
            (this.injectorDefTypes = new Set(this.get(Sh.multi, q, R.Self)));
        }
        destroy() {
          this.assertNotDestroyed(), (this._destroyed = !0);
          try {
            for (const t of this._ngOnDestroyHooks) t.ngOnDestroy();
            for (const t of this._onDestroyHooks) t();
          } finally {
            this.records.clear(),
              this._ngOnDestroyHooks.clear(),
              this.injectorDefTypes.clear(),
              (this._onDestroyHooks.length = 0);
          }
        }
        onDestroy(t) {
          this._onDestroyHooks.push(t);
        }
        runInContext(t) {
          this.assertNotDestroyed();
          const n = qn(this),
            r = at(void 0);
          try {
            return t();
          } finally {
            qn(n), at(r);
          }
        }
        get(t, n = qr, r = R.Default) {
          this.assertNotDestroyed(), (r = fi(r));
          const o = qn(this),
            i = at(void 0);
          try {
            if (!(r & R.SkipSelf)) {
              let a = this.records.get(t);
              if (void 0 === a) {
                const u =
                  (function pE(e) {
                    return (
                      "function" == typeof e ||
                      ("object" == typeof e && e instanceof N)
                    );
                  })(t) && ci(t);
                (a = u && this.injectableDefInScope(u) ? dr(Ru(t), Ui) : null),
                  this.records.set(t, a);
              }
              if (null != a) return this.hydrate(t, a);
            }
            return (r & R.Self ? Hi() : this.parent).get(
              t,
              (n = r & R.Optional && n === qr ? null : n)
            );
          } catch (s) {
            if ("NullInjectorError" === s.name) {
              if (((s[di] = s[di] || []).unshift(ee(t)), o)) throw s;
              return (function Vw(e, t, n, r) {
                const o = e[di];
                throw (
                  (t[Pd] && o.unshift(t[Pd]),
                  (e.message = (function Bw(e, t, n, r = null) {
                    e =
                      e && "\n" === e.charAt(0) && e.charAt(1) == Lw
                        ? e.slice(2)
                        : e;
                    let o = ee(t);
                    if (Array.isArray(t)) o = t.map(ee).join(" -> ");
                    else if ("object" == typeof t) {
                      let i = [];
                      for (let s in t)
                        if (t.hasOwnProperty(s)) {
                          let a = t[s];
                          i.push(
                            s +
                              ":" +
                              ("string" == typeof a ? JSON.stringify(a) : ee(a))
                          );
                        }
                      o = `{${i.join(", ")}}`;
                    }
                    return `${n}${r ? "(" + r + ")" : ""}[${o}]: ${e.replace(
                      kw,
                      "\n  "
                    )}`;
                  })("\n" + e.message, o, n, r)),
                  (e[Fw] = o),
                  (e[di] = null),
                  e)
                );
              })(s, t, "R3InjectorError", this.source);
            }
            throw s;
          } finally {
            at(i), qn(o);
          }
        }
        resolveInjectorInitializers() {
          const t = qn(this),
            n = at(void 0);
          try {
            const r = this.get(Bi.multi, q, R.Self);
            for (const o of r) o();
          } finally {
            qn(t), at(n);
          }
        }
        toString() {
          const t = [],
            n = this.records;
          for (const r of n.keys()) t.push(ee(r));
          return `R3Injector[${t.join(", ")}]`;
        }
        assertNotDestroyed() {
          if (this._destroyed) throw new w(205, !1);
        }
        processProvider(t) {
          let n = Nn((t = A(t))) ? t : A(t && t.provide);
          const r = (function dE(e) {
            return Mu(e)
              ? dr(void 0, e.useValue)
              : dr(
                  (function xh(e, t, n) {
                    let r;
                    if (Nn(e)) {
                      const o = A(e);
                      return Mn(o) || Ru(o);
                    }
                    if (Mu(e)) r = () => A(e.useValue);
                    else if (
                      (function Ah(e) {
                        return !(!e || !e.useFactory);
                      })(e)
                    )
                      r = () => e.useFactory(...Ea(e.deps || []));
                    else if (
                      (function Th(e) {
                        return !(!e || !e.useExisting);
                      })(e)
                    )
                      r = () => x(A(e.useExisting));
                    else {
                      const o = A(e && (e.useClass || e.provide));
                      if (
                        !(function fE(e) {
                          return !!e.deps;
                        })(e)
                      )
                        return Mn(o) || Ru(o);
                      r = () => new o(...Ea(e.deps));
                    }
                    return r;
                  })(e),
                  Ui
                );
          })(t);
          if (Nn(t) || !0 !== t.multi) this.records.get(n);
          else {
            let o = this.records.get(n);
            o ||
              ((o = dr(void 0, Ui, !0)),
              (o.factory = () => Ea(o.multi)),
              this.records.set(n, o)),
              (n = t),
              o.multi.push(t);
          }
          this.records.set(n, r);
        }
        hydrate(t, n) {
          return (
            n.value === Ui && ((n.value = cE), (n.value = n.factory())),
            "object" == typeof n.value &&
              n.value &&
              (function hE(e) {
                return (
                  null !== e &&
                  "object" == typeof e &&
                  "function" == typeof e.ngOnDestroy
                );
              })(n.value) &&
              this._ngOnDestroyHooks.add(n.value),
            n.value
          );
        }
        injectableDefInScope(t) {
          if (!t.providedIn) return !1;
          const n = A(t.providedIn);
          return "string" == typeof n
            ? "any" === n || this.scopes.has(n)
            : this.injectorDefTypes.has(n);
        }
      }
      function Ru(e) {
        const t = ci(e),
          n = null !== t ? t.factory : Mn(e);
        if (null !== n) return n;
        if (e instanceof N) throw new w(204, !1);
        if (e instanceof Function)
          return (function lE(e) {
            const t = e.length;
            if (t > 0)
              throw (
                ((function ao(e, t) {
                  const n = [];
                  for (let r = 0; r < e; r++) n.push(t);
                  return n;
                })(t, "?"),
                new w(204, !1))
              );
            const n = (function Pw(e) {
              return (e && (e[li] || e[Rd])) || null;
            })(e);
            return null !== n ? () => n.factory(e) : () => new e();
          })(e);
        throw new w(204, !1);
      }
      function dr(e, t, n = !1) {
        return { factory: e, value: t, multi: n ? [] : void 0 };
      }
      function xu(e, t) {
        for (const n of e)
          Array.isArray(n) ? xu(n, t) : n && Da(n) ? xu(n.ɵproviders, t) : t(n);
      }
      class gE {}
      class Ph {}
      class yE {
        resolveComponentFactory(t) {
          throw (function mE(e) {
            const t = Error(
              `No component factory found for ${ee(
                e
              )}. Did you add it to @NgModule.entryComponents?`
            );
            return (t.ngComponent = e), t;
          })(t);
        }
      }
      let Do = (() => {
        class e {}
        return (e.NULL = new yE()), e;
      })();
      function vE() {
        return fr(Me(), v());
      }
      function fr(e, t) {
        return new dn(tt(e, t));
      }
      let dn = (() => {
        class e {
          constructor(n) {
            this.nativeElement = n;
          }
        }
        return (e.__NG_ELEMENT_ID__ = vE), e;
      })();
      class Oh {}
      let CE = (() => {
        class e {}
        return (
          (e.ɵprov = P({ token: e, providedIn: "root", factory: () => null })),
          e
        );
      })();
      class Gi {
        constructor(t) {
          (this.full = t),
            (this.major = t.split(".")[0]),
            (this.minor = t.split(".")[1]),
            (this.patch = t.split(".").slice(2).join("."));
        }
      }
      const _E = new Gi("15.2.10"),
        Pu = {},
        Nu = "ngOriginalError";
      function Ou(e) {
        return e[Nu];
      }
      class hr {
        constructor() {
          this._console = console;
        }
        handleError(t) {
          const n = this._findOriginalError(t);
          this._console.error("ERROR", t),
            n && this._console.error("ORIGINAL ERROR", n);
        }
        _findOriginalError(t) {
          let n = t && Ou(t);
          for (; n && Ou(n); ) n = Ou(n);
          return n || null;
        }
      }
      function Yt(e) {
        return e instanceof Function ? e() : e;
      }
      function kh(e, t, n) {
        let r = e.length;
        for (;;) {
          const o = e.indexOf(t, n);
          if (-1 === o) return o;
          if (0 === o || e.charCodeAt(o - 1) <= 32) {
            const i = t.length;
            if (o + i === r || e.charCodeAt(o + i) <= 32) return o;
          }
          n = o + 1;
        }
      }
      const Lh = "ng-template";
      function NE(e, t, n) {
        let r = 0,
          o = !0;
        for (; r < e.length; ) {
          let i = e[r++];
          if ("string" == typeof i && o) {
            const s = e[r++];
            if (n && "class" === i && -1 !== kh(s.toLowerCase(), t, 0))
              return !0;
          } else {
            if (1 === i) {
              for (; r < e.length && "string" == typeof (i = e[r++]); )
                if (i.toLowerCase() === t) return !0;
              return !1;
            }
            "number" == typeof i && (o = !1);
          }
        }
        return !1;
      }
      function jh(e) {
        return 4 === e.type && e.value !== Lh;
      }
      function OE(e, t, n) {
        return t === (4 !== e.type || n ? e.value : Lh);
      }
      function FE(e, t, n) {
        let r = 4;
        const o = e.attrs || [],
          i = (function jE(e) {
            for (let t = 0; t < e.length; t++) if (df(e[t])) return t;
            return e.length;
          })(o);
        let s = !1;
        for (let a = 0; a < t.length; a++) {
          const u = t[a];
          if ("number" != typeof u) {
            if (!s)
              if (4 & r) {
                if (
                  ((r = 2 | (1 & r)),
                  ("" !== u && !OE(e, u, n)) || ("" === u && 1 === t.length))
                ) {
                  if (yt(r)) return !1;
                  s = !0;
                }
              } else {
                const c = 8 & r ? u : t[++a];
                if (8 & r && null !== e.attrs) {
                  if (!NE(e.attrs, c, n)) {
                    if (yt(r)) return !1;
                    s = !0;
                  }
                  continue;
                }
                const d = kE(8 & r ? "class" : u, o, jh(e), n);
                if (-1 === d) {
                  if (yt(r)) return !1;
                  s = !0;
                  continue;
                }
                if ("" !== c) {
                  let f;
                  f = d > i ? "" : o[d + 1].toLowerCase();
                  const h = 8 & r ? f : null;
                  if ((h && -1 !== kh(h, c, 0)) || (2 & r && c !== f)) {
                    if (yt(r)) return !1;
                    s = !0;
                  }
                }
              }
          } else {
            if (!s && !yt(r) && !yt(u)) return !1;
            if (s && yt(u)) continue;
            (s = !1), (r = u | (1 & r));
          }
        }
        return yt(r) || s;
      }
      function yt(e) {
        return 0 == (1 & e);
      }
      function kE(e, t, n, r) {
        if (null === t) return -1;
        let o = 0;
        if (r || !n) {
          let i = !1;
          for (; o < t.length; ) {
            const s = t[o];
            if (s === e) return o;
            if (3 === s || 6 === s) i = !0;
            else {
              if (1 === s || 2 === s) {
                let a = t[++o];
                for (; "string" == typeof a; ) a = t[++o];
                continue;
              }
              if (4 === s) break;
              if (0 === s) {
                o += 4;
                continue;
              }
            }
            o += i ? 1 : 2;
          }
          return -1;
        }
        return (function $E(e, t) {
          let n = e.indexOf(4);
          if (n > -1)
            for (n++; n < e.length; ) {
              const r = e[n];
              if ("number" == typeof r) return -1;
              if (r === t) return n;
              n++;
            }
          return -1;
        })(t, e);
      }
      function $h(e, t, n = !1) {
        for (let r = 0; r < t.length; r++) if (FE(e, t[r], n)) return !0;
        return !1;
      }
      function Vh(e, t) {
        return e ? ":not(" + t.trim() + ")" : t;
      }
      function BE(e) {
        let t = e[0],
          n = 1,
          r = 2,
          o = "",
          i = !1;
        for (; n < e.length; ) {
          let s = e[n];
          if ("string" == typeof s)
            if (2 & r) {
              const a = e[++n];
              o += "[" + s + (a.length > 0 ? '="' + a + '"' : "") + "]";
            } else 8 & r ? (o += "." + s) : 4 & r && (o += " " + s);
          else
            "" !== o && !yt(s) && ((t += Vh(i, o)), (o = "")),
              (r = s),
              (i = i || !yt(r));
          n++;
        }
        return "" !== o && (t += Vh(i, o)), t;
      }
      const L = {};
      function Qe(e) {
        Bh(W(), v(), $e() + e, !1);
      }
      function Bh(e, t, n, r) {
        if (!r)
          if (3 == (3 & t[$])) {
            const i = e.preOrderCheckHooks;
            null !== i && Ei(t, i, n);
          } else {
            const i = e.preOrderHooks;
            null !== i && Si(t, i, 0, n);
          }
        An(n);
      }
      function Gh(e, t = null, n = null, r) {
        const o = Wh(e, t, n, r);
        return o.resolveInjectorInitializers(), o;
      }
      function Wh(e, t = null, n = null, r, o = new Set()) {
        const i = [n || q, sE(e)];
        return (
          (r = r || ("object" == typeof e ? void 0 : ee(e))),
          new Rh(i, t || Hi(), r || null, o)
        );
      }
      let Kt = (() => {
        class e {
          static create(n, r) {
            if (Array.isArray(n)) return Gh({ name: "" }, r, n, "");
            {
              const o = n.name ?? "";
              return Gh({ name: o }, n.parent, n.providers, o);
            }
          }
        }
        return (
          (e.THROW_IF_NOT_FOUND = qr),
          (e.NULL = new bh()),
          (e.ɵprov = P({ token: e, providedIn: "any", factory: () => x(Eh) })),
          (e.__NG_ELEMENT_ID__ = -1),
          e
        );
      })();
      function I(e, t = R.Default) {
        const n = v();
        return null === n ? x(e, t) : wf(Me(), n, A(e), t);
      }
      function ep(e, t) {
        const n = e.contentQueries;
        if (null !== n)
          for (let r = 0; r < n.length; r += 2) {
            const i = n[r + 1];
            if (-1 !== i) {
              const s = e.data[i];
              La(n[r]), s.contentQueries(2, t[i], i);
            }
          }
      }
      function qi(e, t, n, r, o, i, s, a, u, c, l) {
        const d = t.blueprint.slice();
        return (
          (d[Gt] = o),
          (d[$] = 76 | r),
          (null !== l || (e && 1024 & e[$])) && (d[$] |= 1024),
          Qd(d),
          (d[ae] = d[Yn] = e),
          (d[ce] = n),
          (d[mi] = s || (e && e[mi])),
          (d[B] = a || (e && e[B])),
          (d[Ia] = u || (e && e[Ia]) || null),
          (d[gi] = c || (e && e[gi]) || null),
          (d[xe] = i),
          (d[eo] = (function a_() {
            return s_++;
          })()),
          (d[$d] = l),
          (d[Pe] = 2 == t.type ? e[Pe] : d),
          d
        );
      }
      function mr(e, t, n, r, o) {
        let i = e.data[t];
        if (null === i)
          (i = (function $u(e, t, n, r, o) {
            const i = Xd(),
              s = Na(),
              u = (e.data[t] = (function p0(e, t, n, r, o, i) {
                return {
                  type: n,
                  index: r,
                  insertBeforeIndex: null,
                  injectorIndex: t ? t.injectorIndex : -1,
                  directiveStart: -1,
                  directiveEnd: -1,
                  directiveStylingLast: -1,
                  componentOffset: -1,
                  propertyBindings: null,
                  flags: 0,
                  providerIndexes: 0,
                  value: o,
                  attrs: i,
                  mergedAttrs: null,
                  localNames: null,
                  initialInputs: void 0,
                  inputs: null,
                  outputs: null,
                  tView: null,
                  next: null,
                  prev: null,
                  projectionNext: null,
                  child: null,
                  parent: t,
                  projection: null,
                  styles: null,
                  stylesWithoutHost: null,
                  residualStyles: void 0,
                  classes: null,
                  classesWithoutHost: null,
                  residualClasses: void 0,
                  classBindings: 0,
                  styleBindings: 0,
                };
              })(0, s ? i : i && i.parent, n, t, r, o));
            return (
              null === e.firstChild && (e.firstChild = u),
              null !== i &&
                (s
                  ? null == i.child && null !== u.parent && (i.child = u)
                  : null === i.next && ((i.next = u), (u.prev = i))),
              u
            );
          })(e, t, n, r, o)),
            (function dC() {
              return k.lFrame.inI18n;
            })() && (i.flags |= 32);
        else if (64 & i.type) {
          (i.type = n), (i.value = r), (i.attrs = o);
          const s = (function no() {
            const e = k.lFrame,
              t = e.currentTNode;
            return e.isParent ? t : t.parent;
          })();
          i.injectorIndex = null === s ? -1 : s.injectorIndex;
        }
        return Rt(i, !0), i;
      }
      function wo(e, t, n, r) {
        if (0 === n) return -1;
        const o = t.length;
        for (let i = 0; i < n; i++)
          t.push(r), e.blueprint.push(r), e.data.push(null);
        return o;
      }
      function Vu(e, t, n) {
        ja(t);
        try {
          const r = e.viewQuery;
          null !== r && Qu(1, r, n);
          const o = e.template;
          null !== o && tp(e, t, o, 1, n),
            e.firstCreatePass && (e.firstCreatePass = !1),
            e.staticContentQueries && ep(e, t),
            e.staticViewQueries && Qu(2, e.viewQuery, n);
          const i = e.components;
          null !== i &&
            (function d0(e, t) {
              for (let n = 0; n < t.length; n++) O0(e, t[n]);
            })(t, i);
        } catch (r) {
          throw (
            (e.firstCreatePass &&
              ((e.incompleteFirstPass = !0), (e.firstCreatePass = !1)),
            r)
          );
        } finally {
          (t[$] &= -5), $a();
        }
      }
      function Zi(e, t, n, r) {
        const o = t[$];
        if (128 != (128 & o)) {
          ja(t);
          try {
            Qd(t),
              (function ef(e) {
                return (k.lFrame.bindingIndex = e);
              })(e.bindingStartIndex),
              null !== n && tp(e, t, n, 2, r);
            const s = 3 == (3 & o);
            if (s) {
              const c = e.preOrderCheckHooks;
              null !== c && Ei(t, c, null);
            } else {
              const c = e.preOrderHooks;
              null !== c && Si(t, c, 0, null), Va(t, 0);
            }
            if (
              ((function P0(e) {
                for (let t = au(e); null !== t; t = uu(t)) {
                  if (!t[Vd]) continue;
                  const n = t[Xn];
                  for (let r = 0; r < n.length; r++) {
                    const o = n[r];
                    512 & o[$] || Ra(o[ae], 1), (o[$] |= 512);
                  }
                }
              })(t),
              (function x0(e) {
                for (let t = au(e); null !== t; t = uu(t))
                  for (let n = Le; n < t.length; n++) {
                    const r = t[n],
                      o = r[E];
                    Ci(r) && Zi(o, r, o.template, r[ce]);
                  }
              })(t),
              null !== e.contentQueries && ep(e, t),
              s)
            ) {
              const c = e.contentCheckHooks;
              null !== c && Ei(t, c);
            } else {
              const c = e.contentHooks;
              null !== c && Si(t, c, 1), Va(t, 1);
            }
            !(function c0(e, t) {
              const n = e.hostBindingOpCodes;
              if (null !== n)
                try {
                  for (let r = 0; r < n.length; r++) {
                    const o = n[r];
                    if (o < 0) An(~o);
                    else {
                      const i = o,
                        s = n[++r],
                        a = n[++r];
                      fC(s, i), a(2, t[i]);
                    }
                  }
                } finally {
                  An(-1);
                }
            })(e, t);
            const a = e.components;
            null !== a &&
              (function l0(e, t) {
                for (let n = 0; n < t.length; n++) N0(e, t[n]);
              })(t, a);
            const u = e.viewQuery;
            if ((null !== u && Qu(2, u, r), s)) {
              const c = e.viewCheckHooks;
              null !== c && Ei(t, c);
            } else {
              const c = e.viewHooks;
              null !== c && Si(t, c, 2), Va(t, 2);
            }
            !0 === e.firstUpdatePass && (e.firstUpdatePass = !1),
              (t[$] &= -41),
              512 & t[$] && ((t[$] &= -513), Ra(t[ae], -1));
          } finally {
            $a();
          }
        }
      }
      function tp(e, t, n, r, o) {
        const i = $e(),
          s = 2 & r;
        try {
          An(-1),
            s && t.length > re && Bh(e, t, re, !1),
            ut(s ? 2 : 0, o),
            n(r, o);
        } finally {
          An(i), ut(s ? 3 : 1, o);
        }
      }
      function Bu(e, t, n) {
        if (Ta(t)) {
          const o = t.directiveEnd;
          for (let i = t.directiveStart; i < o; i++) {
            const s = e.data[i];
            s.contentQueries && s.contentQueries(1, n[i], i);
          }
        }
      }
      function Uu(e, t, n) {
        Kd() &&
          ((function C0(e, t, n, r) {
            const o = n.directiveStart,
              i = n.directiveEnd;
            to(n) &&
              (function T0(e, t, n) {
                const r = tt(t, e),
                  o = np(n),
                  i = e[mi],
                  s = Qi(
                    e,
                    qi(
                      e,
                      o,
                      null,
                      n.onPush ? 32 : 16,
                      r,
                      t,
                      i,
                      i.createRenderer(r, n),
                      null,
                      null,
                      null
                    )
                  );
                e[t.index] = s;
              })(t, n, e.data[o + n.componentOffset]),
              e.firstCreatePass || Ti(n, t),
              Ne(r, t);
            const s = n.initialInputs;
            for (let a = o; a < i; a++) {
              const u = e.data[a],
                c = Rn(t, e, a, n);
              Ne(c, t),
                null !== s && A0(0, a - o, c, u, 0, s),
                mt(u) && (We(n.index, t)[ce] = Rn(t, e, a, n));
            }
          })(e, t, n, tt(n, t)),
          64 == (64 & n.flags) && ap(e, t, n));
      }
      function Hu(e, t, n = tt) {
        const r = t.localNames;
        if (null !== r) {
          let o = t.index + 1;
          for (let i = 0; i < r.length; i += 2) {
            const s = r[i + 1],
              a = -1 === s ? n(t, e) : e[s];
            e[o++] = a;
          }
        }
      }
      function np(e) {
        const t = e.tView;
        return null === t || t.incompleteFirstPass
          ? (e.tView = zu(
              1,
              null,
              e.template,
              e.decls,
              e.vars,
              e.directiveDefs,
              e.pipeDefs,
              e.viewQuery,
              e.schemas,
              e.consts
            ))
          : t;
      }
      function zu(e, t, n, r, o, i, s, a, u, c) {
        const l = re + r,
          d = l + o,
          f = (function f0(e, t) {
            const n = [];
            for (let r = 0; r < t; r++) n.push(r < e ? null : L);
            return n;
          })(l, d),
          h = "function" == typeof c ? c() : c;
        return (f[E] = {
          type: e,
          blueprint: f,
          template: n,
          queries: null,
          viewQuery: a,
          declTNode: t,
          data: f.slice().fill(null, l),
          bindingStartIndex: l,
          expandoStartIndex: d,
          hostBindingOpCodes: null,
          firstCreatePass: !0,
          firstUpdatePass: !0,
          staticViewQueries: !1,
          staticContentQueries: !1,
          preOrderHooks: null,
          preOrderCheckHooks: null,
          contentHooks: null,
          contentCheckHooks: null,
          viewHooks: null,
          viewCheckHooks: null,
          destroyHooks: null,
          cleanup: null,
          contentQueries: null,
          components: null,
          directiveRegistry: "function" == typeof i ? i() : i,
          pipeRegistry: "function" == typeof s ? s() : s,
          firstChild: null,
          schemas: u,
          consts: h,
          incompleteFirstPass: !1,
        });
      }
      function op(e, t, n, r) {
        for (let o in e)
          if (e.hasOwnProperty(o)) {
            n = null === n ? {} : n;
            const i = e[o];
            null === r
              ? ip(n, t, o, i)
              : r.hasOwnProperty(o) && ip(n, t, r[o], i);
          }
        return n;
      }
      function ip(e, t, n, r) {
        e.hasOwnProperty(n) ? e[n].push(t, r) : (e[n] = [t, r]);
      }
      function rt(e, t, n, r, o, i, s, a) {
        const u = tt(t, n);
        let l,
          c = t.inputs;
        !a && null != c && (l = c[r])
          ? (Yu(e, n, l, r, o),
            to(t) &&
              (function y0(e, t) {
                const n = We(t, e);
                16 & n[$] || (n[$] |= 32);
              })(n, t.index))
          : 3 & t.type &&
            ((r = (function m0(e) {
              return "class" === e
                ? "className"
                : "for" === e
                ? "htmlFor"
                : "formaction" === e
                ? "formAction"
                : "innerHtml" === e
                ? "innerHTML"
                : "readonly" === e
                ? "readOnly"
                : "tabindex" === e
                ? "tabIndex"
                : e;
            })(r)),
            (o = null != s ? s(o, t.value || "", r) : o),
            i.setProperty(u, r, o));
      }
      function Gu(e, t, n, r) {
        if (Kd()) {
          const o = null === r ? null : { "": -1 },
            i = (function E0(e, t) {
              const n = e.directiveRegistry;
              let r = null,
                o = null;
              if (n)
                for (let i = 0; i < n.length; i++) {
                  const s = n[i];
                  if ($h(t, s.selectors, !1))
                    if ((r || (r = []), mt(s)))
                      if (null !== s.findHostDirectiveDefs) {
                        const a = [];
                        (o = o || new Map()),
                          s.findHostDirectiveDefs(s, a, o),
                          r.unshift(...a, s),
                          Wu(e, t, a.length);
                      } else r.unshift(s), Wu(e, t, 0);
                    else
                      (o = o || new Map()),
                        s.findHostDirectiveDefs?.(s, r, o),
                        r.push(s);
                }
              return null === r ? null : [r, o];
            })(e, n);
          let s, a;
          null === i ? (s = a = null) : ([s, a] = i),
            null !== s && sp(e, t, n, s, o, a),
            o &&
              (function S0(e, t, n) {
                if (t) {
                  const r = (e.localNames = []);
                  for (let o = 0; o < t.length; o += 2) {
                    const i = n[t[o + 1]];
                    if (null == i) throw new w(-301, !1);
                    r.push(t[o], i);
                  }
                }
              })(n, r, o);
        }
        n.mergedAttrs = oo(n.mergedAttrs, n.attrs);
      }
      function sp(e, t, n, r, o, i) {
        for (let c = 0; c < r.length; c++) Wa(Ti(n, t), e, r[c].type);
        !(function I0(e, t, n) {
          (e.flags |= 1),
            (e.directiveStart = t),
            (e.directiveEnd = t + n),
            (e.providerIndexes = t);
        })(n, e.data.length, r.length);
        for (let c = 0; c < r.length; c++) {
          const l = r[c];
          l.providersResolver && l.providersResolver(l);
        }
        let s = !1,
          a = !1,
          u = wo(e, t, r.length, null);
        for (let c = 0; c < r.length; c++) {
          const l = r[c];
          (n.mergedAttrs = oo(n.mergedAttrs, l.hostAttrs)),
            M0(e, n, t, u, l),
            b0(u, l, o),
            null !== l.contentQueries && (n.flags |= 4),
            (null !== l.hostBindings ||
              null !== l.hostAttrs ||
              0 !== l.hostVars) &&
              (n.flags |= 64);
          const d = l.type.prototype;
          !s &&
            (d.ngOnChanges || d.ngOnInit || d.ngDoCheck) &&
            ((e.preOrderHooks ?? (e.preOrderHooks = [])).push(n.index),
            (s = !0)),
            !a &&
              (d.ngOnChanges || d.ngDoCheck) &&
              ((e.preOrderCheckHooks ?? (e.preOrderCheckHooks = [])).push(
                n.index
              ),
              (a = !0)),
            u++;
        }
        !(function g0(e, t, n) {
          const o = t.directiveEnd,
            i = e.data,
            s = t.attrs,
            a = [];
          let u = null,
            c = null;
          for (let l = t.directiveStart; l < o; l++) {
            const d = i[l],
              f = n ? n.get(d) : null,
              p = f ? f.outputs : null;
            (u = op(d.inputs, l, u, f ? f.inputs : null)),
              (c = op(d.outputs, l, c, p));
            const g = null === u || null === s || jh(t) ? null : R0(u, l, s);
            a.push(g);
          }
          null !== u &&
            (u.hasOwnProperty("class") && (t.flags |= 8),
            u.hasOwnProperty("style") && (t.flags |= 16)),
            (t.initialInputs = a),
            (t.inputs = u),
            (t.outputs = c);
        })(e, n, i);
      }
      function ap(e, t, n) {
        const r = n.directiveStart,
          o = n.directiveEnd,
          i = n.index,
          s = (function hC() {
            return k.lFrame.currentDirectiveIndex;
          })();
        try {
          An(i);
          for (let a = r; a < o; a++) {
            const u = e.data[a],
              c = t[a];
            Fa(a),
              (null !== u.hostBindings ||
                0 !== u.hostVars ||
                null !== u.hostAttrs) &&
                _0(u, c);
          }
        } finally {
          An(-1), Fa(s);
        }
      }
      function _0(e, t) {
        null !== e.hostBindings && e.hostBindings(1, t);
      }
      function Wu(e, t, n) {
        (t.componentOffset = n),
          (e.components ?? (e.components = [])).push(t.index);
      }
      function b0(e, t, n) {
        if (n) {
          if (t.exportAs)
            for (let r = 0; r < t.exportAs.length; r++) n[t.exportAs[r]] = e;
          mt(t) && (n[""] = e);
        }
      }
      function M0(e, t, n, r, o) {
        e.data[r] = o;
        const i = o.factory || (o.factory = Mn(o.type)),
          s = new ro(i, mt(o), I);
        (e.blueprint[r] = s),
          (n[r] = s),
          (function D0(e, t, n, r, o) {
            const i = o.hostBindings;
            if (i) {
              let s = e.hostBindingOpCodes;
              null === s && (s = e.hostBindingOpCodes = []);
              const a = ~t.index;
              (function w0(e) {
                let t = e.length;
                for (; t > 0; ) {
                  const n = e[--t];
                  if ("number" == typeof n && n < 0) return n;
                }
                return 0;
              })(s) != a && s.push(a),
                s.push(n, r, i);
            }
          })(e, t, r, wo(e, n, o.hostVars, L), o);
      }
      function A0(e, t, n, r, o, i) {
        const s = i[t];
        if (null !== s) {
          const a = r.setInput;
          for (let u = 0; u < s.length; ) {
            const c = s[u++],
              l = s[u++],
              d = s[u++];
            null !== a ? r.setInput(n, d, c, l) : (n[l] = d);
          }
        }
      }
      function R0(e, t, n) {
        let r = null,
          o = 0;
        for (; o < n.length; ) {
          const i = n[o];
          if (0 !== i)
            if (5 !== i) {
              if ("number" == typeof i) break;
              if (e.hasOwnProperty(i)) {
                null === r && (r = []);
                const s = e[i];
                for (let a = 0; a < s.length; a += 2)
                  if (s[a] === t) {
                    r.push(i, s[a + 1], n[o + 1]);
                    break;
                  }
              }
              o += 2;
            } else o += 2;
          else o += 4;
        }
        return r;
      }
      function up(e, t, n, r) {
        return [e, !0, !1, t, null, 0, r, n, null, null];
      }
      function N0(e, t) {
        const n = We(t, e);
        if (Ci(n)) {
          const r = n[E];
          48 & n[$] ? Zi(r, n, r.template, n[ce]) : n[In] > 0 && Zu(n);
        }
      }
      function Zu(e) {
        for (let r = au(e); null !== r; r = uu(r))
          for (let o = Le; o < r.length; o++) {
            const i = r[o];
            if (Ci(i))
              if (512 & i[$]) {
                const s = i[E];
                Zi(s, i, s.template, i[ce]);
              } else i[In] > 0 && Zu(i);
          }
        const n = e[E].components;
        if (null !== n)
          for (let r = 0; r < n.length; r++) {
            const o = We(n[r], e);
            Ci(o) && o[In] > 0 && Zu(o);
          }
      }
      function O0(e, t) {
        const n = We(t, e),
          r = n[E];
        (function F0(e, t) {
          for (let n = t.length; n < e.blueprint.length; n++)
            t.push(e.blueprint[n]);
        })(r, n),
          Vu(r, n, n[ce]);
      }
      function Qi(e, t) {
        return e[Xr] ? (e[jd][pt] = t) : (e[Xr] = t), (e[jd] = t), t;
      }
      function Yi(e) {
        for (; e; ) {
          e[$] |= 32;
          const t = po(e);
          if (qw(e) && !t) return e;
          e = t;
        }
        return null;
      }
      function Ki(e, t, n, r = !0) {
        const o = t[mi];
        o.begin && o.begin();
        try {
          Zi(e, t, e.template, n);
        } catch (s) {
          throw (r && fp(t, s), s);
        } finally {
          o.end && o.end();
        }
      }
      function Qu(e, t, n) {
        La(0), t(e, n);
      }
      function cp(e) {
        return e[Qn] || (e[Qn] = []);
      }
      function lp(e) {
        return e.cleanup || (e.cleanup = []);
      }
      function fp(e, t) {
        const n = e[gi],
          r = n ? n.get(hr, null) : null;
        r && r.handleError(t);
      }
      function Yu(e, t, n, r, o) {
        for (let i = 0; i < n.length; ) {
          const s = n[i++],
            a = n[i++],
            u = t[s],
            c = e.data[s];
          null !== c.setInput ? c.setInput(u, o, r, a) : (u[a] = o);
        }
      }
      function Xt(e, t, n) {
        const r = (function wi(e, t) {
          return Ie(t[e]);
        })(t, e);
        !(function Qf(e, t, n) {
          e.setValue(t, n);
        })(e[B], r, n);
      }
      function Xi(e, t, n) {
        let r = n ? e.styles : null,
          o = n ? e.classes : null,
          i = 0;
        if (null !== t)
          for (let s = 0; s < t.length; s++) {
            const a = t[s];
            "number" == typeof a
              ? (i = a)
              : 1 == i
              ? (o = ma(o, a))
              : 2 == i && (r = ma(r, a + ": " + t[++s] + ";"));
          }
        n ? (e.styles = r) : (e.stylesWithoutHost = r),
          n ? (e.classes = o) : (e.classesWithoutHost = o);
      }
      function Ji(e, t, n, r, o = !1) {
        for (; null !== n; ) {
          const i = t[n.index];
          if ((null !== i && r.push(Ie(i)), gt(i)))
            for (let a = Le; a < i.length; a++) {
              const u = i[a],
                c = u[E].firstChild;
              null !== c && Ji(u[E], u, c, r);
            }
          const s = n.type;
          if (8 & s) Ji(e, t, n.child, r);
          else if (32 & s) {
            const a = su(n, t);
            let u;
            for (; (u = a()); ) r.push(u);
          } else if (16 & s) {
            const a = sh(t, n);
            if (Array.isArray(a)) r.push(...a);
            else {
              const u = po(t[Pe]);
              Ji(u[E], u, a, r, !0);
            }
          }
          n = o ? n.projectionNext : n.next;
        }
        return r;
      }
      class Co {
        get rootNodes() {
          const t = this._lView,
            n = t[E];
          return Ji(n, t, n.firstChild, []);
        }
        constructor(t, n) {
          (this._lView = t),
            (this._cdRefInjectingView = n),
            (this._appRef = null),
            (this._attachedToViewContainer = !1);
        }
        get context() {
          return this._lView[ce];
        }
        set context(t) {
          this._lView[ce] = t;
        }
        get destroyed() {
          return 128 == (128 & this._lView[$]);
        }
        destroy() {
          if (this._appRef) this._appRef.detachView(this);
          else if (this._attachedToViewContainer) {
            const t = this._lView[ae];
            if (gt(t)) {
              const n = t[vi],
                r = n ? n.indexOf(this) : -1;
              r > -1 && (du(t, r), xi(n, r));
            }
            this._attachedToViewContainer = !1;
          }
          Kf(this._lView[E], this._lView);
        }
        onDestroy(t) {
          !(function rp(e, t, n, r) {
            const o = cp(t);
            null === n
              ? o.push(r)
              : (o.push(n), e.firstCreatePass && lp(e).push(r, o.length - 1));
          })(this._lView[E], this._lView, null, t);
        }
        markForCheck() {
          Yi(this._cdRefInjectingView || this._lView);
        }
        detach() {
          this._lView[$] &= -65;
        }
        reattach() {
          this._lView[$] |= 64;
        }
        detectChanges() {
          Ki(this._lView[E], this._lView, this.context);
        }
        checkNoChanges() {}
        attachToViewContainerRef() {
          if (this._appRef) throw new w(902, !1);
          this._attachedToViewContainer = !0;
        }
        detachFromAppRef() {
          (this._appRef = null),
            (function __(e, t) {
              go(e, t, t[B], 2, null, null);
            })(this._lView[E], this._lView);
        }
        attachToAppRef(t) {
          if (this._attachedToViewContainer) throw new w(902, !1);
          this._appRef = t;
        }
      }
      class k0 extends Co {
        constructor(t) {
          super(t), (this._view = t);
        }
        detectChanges() {
          const t = this._view;
          Ki(t[E], t, t[ce], !1);
        }
        checkNoChanges() {}
        get context() {
          return null;
        }
      }
      class hp extends Do {
        constructor(t) {
          super(), (this.ngModule = t);
        }
        resolveComponentFactory(t) {
          const n = K(t);
          return new _o(n, this.ngModule);
        }
      }
      function pp(e) {
        const t = [];
        for (let n in e)
          e.hasOwnProperty(n) && t.push({ propName: e[n], templateName: n });
        return t;
      }
      class j0 {
        constructor(t, n) {
          (this.injector = t), (this.parentInjector = n);
        }
        get(t, n, r) {
          r = fi(r);
          const o = this.injector.get(t, Pu, r);
          return o !== Pu || n === Pu ? o : this.parentInjector.get(t, n, r);
        }
      }
      class _o extends Ph {
        get inputs() {
          return pp(this.componentDef.inputs);
        }
        get outputs() {
          return pp(this.componentDef.outputs);
        }
        constructor(t, n) {
          super(),
            (this.componentDef = t),
            (this.ngModule = n),
            (this.componentType = t.type),
            (this.selector = (function UE(e) {
              return e.map(BE).join(",");
            })(t.selectors)),
            (this.ngContentSelectors = t.ngContentSelectors
              ? t.ngContentSelectors
              : []),
            (this.isBoundToModule = !!n);
        }
        create(t, n, r, o) {
          let i = (o = o || this.ngModule) instanceof Qt ? o : o?.injector;
          i &&
            null !== this.componentDef.getStandaloneInjector &&
            (i = this.componentDef.getStandaloneInjector(i) || i);
          const s = i ? new j0(t, i) : t,
            a = s.get(Oh, null);
          if (null === a) throw new w(407, !1);
          const u = s.get(CE, null),
            c = a.createRenderer(null, this.componentDef),
            l = this.componentDef.selectors[0][0] || "div",
            d = r
              ? (function h0(e, t, n) {
                  return e.selectRootElement(t, n === Tt.ShadowDom);
                })(c, r, this.componentDef.encapsulation)
              : lu(
                  c,
                  l,
                  (function L0(e) {
                    const t = e.toLowerCase();
                    return "svg" === t ? "svg" : "math" === t ? "math" : null;
                  })(l)
                ),
            f = this.componentDef.onPush ? 288 : 272,
            h = zu(0, null, null, 1, 0, null, null, null, null, null),
            p = qi(null, h, null, f, null, null, a, c, u, s, null);
          let g, y;
          ja(p);
          try {
            const D = this.componentDef;
            let _,
              m = null;
            D.findHostDirectiveDefs
              ? ((_ = []),
                (m = new Map()),
                D.findHostDirectiveDefs(D, _, m),
                _.push(D))
              : (_ = [D]);
            const b = (function V0(e, t) {
                const n = e[E],
                  r = re;
                return (e[r] = t), mr(n, r, 2, "#host", null);
              })(p, d),
              Z = (function B0(e, t, n, r, o, i, s, a) {
                const u = o[E];
                !(function U0(e, t, n, r) {
                  for (const o of e)
                    t.mergedAttrs = oo(t.mergedAttrs, o.hostAttrs);
                  null !== t.mergedAttrs &&
                    (Xi(t, t.mergedAttrs, !0), null !== n && ch(r, n, t));
                })(r, e, t, s);
                const c = i.createRenderer(t, n),
                  l = qi(
                    o,
                    np(n),
                    null,
                    n.onPush ? 32 : 16,
                    o[e.index],
                    e,
                    i,
                    c,
                    a || null,
                    null,
                    null
                  );
                return (
                  u.firstCreatePass && Wu(u, e, r.length - 1),
                  Qi(o, l),
                  (o[e.index] = l)
                );
              })(b, d, D, _, p, a, c);
            (y = Zd(h, re)),
              d &&
                (function z0(e, t, n, r) {
                  if (r) Ua(e, n, ["ng-version", _E.full]);
                  else {
                    const { attrs: o, classes: i } = (function HE(e) {
                      const t = [],
                        n = [];
                      let r = 1,
                        o = 2;
                      for (; r < e.length; ) {
                        let i = e[r];
                        if ("string" == typeof i)
                          2 === o
                            ? "" !== i && t.push(i, e[++r])
                            : 8 === o && n.push(i);
                        else {
                          if (!yt(o)) break;
                          o = i;
                        }
                        r++;
                      }
                      return { attrs: t, classes: n };
                    })(t.selectors[0]);
                    o && Ua(e, n, o),
                      i && i.length > 0 && uh(e, n, i.join(" "));
                  }
                })(c, D, d, r),
              void 0 !== n &&
                (function G0(e, t, n) {
                  const r = (e.projection = []);
                  for (let o = 0; o < t.length; o++) {
                    const i = n[o];
                    r.push(null != i ? Array.from(i) : null);
                  }
                })(y, this.ngContentSelectors, n),
              (g = (function H0(e, t, n, r, o, i) {
                const s = Me(),
                  a = o[E],
                  u = tt(s, o);
                sp(a, o, s, n, null, r);
                for (let l = 0; l < n.length; l++)
                  Ne(Rn(o, a, s.directiveStart + l, s), o);
                ap(a, o, s), u && Ne(u, o);
                const c = Rn(o, a, s.directiveStart + s.componentOffset, s);
                if (((e[ce] = o[ce] = c), null !== i))
                  for (const l of i) l(c, t);
                return Bu(a, s, e), c;
              })(Z, D, _, m, p, [W0])),
              Vu(h, p, null);
          } finally {
            $a();
          }
          return new $0(this.componentType, g, fr(y, p), p, y);
        }
      }
      class $0 extends gE {
        constructor(t, n, r, o, i) {
          super(),
            (this.location = r),
            (this._rootLView = o),
            (this._tNode = i),
            (this.instance = n),
            (this.hostView = this.changeDetectorRef = new k0(o)),
            (this.componentType = t);
        }
        setInput(t, n) {
          const r = this._tNode.inputs;
          let o;
          if (null !== r && (o = r[t])) {
            const i = this._rootLView;
            Yu(i[E], i, o, t, n), Yi(We(this._tNode.index, i));
          }
        }
        get injector() {
          return new nr(this._tNode, this._rootLView);
        }
        destroy() {
          this.hostView.destroy();
        }
        onDestroy(t) {
          this.hostView.onDestroy(t);
        }
      }
      function W0() {
        const e = Me();
        _i(v()[E], e);
      }
      function es(e) {
        return (
          !!(function Xu(e) {
            return (
              null !== e && ("function" == typeof e || "object" == typeof e)
            );
          })(e) &&
          (Array.isArray(e) || (!(e instanceof Map) && Symbol.iterator in e))
        );
      }
      function Oe(e, t, n) {
        return !Object.is(e[t], n) && ((e[t] = n), !0);
      }
      function vr(e, t, n, r) {
        return Oe(e, er(), n) ? t + F(n) + r : L;
      }
      function ec(e, t, n, r, o, i, s, a) {
        const u = v(),
          c = W(),
          l = e + re,
          d = c.firstCreatePass
            ? (function sS(e, t, n, r, o, i, s, a, u) {
                const c = t.consts,
                  l = mr(t, e, 4, s || null, cn(c, a));
                Gu(t, n, l, cn(c, u)), _i(t, l);
                const d = (l.tView = zu(
                  2,
                  l,
                  r,
                  o,
                  i,
                  t.directiveRegistry,
                  t.pipeRegistry,
                  null,
                  t.schemas,
                  c
                ));
                return (
                  null !== t.queries &&
                    (t.queries.template(t, l),
                    (d.queries = t.queries.embeddedTView(l))),
                  l
                );
              })(l, c, u, t, n, r, o, i, s)
            : c.data[l];
        Rt(d, !1);
        const f = u[B].createComment("");
        ki(c, u, f, d),
          Ne(f, u),
          Qi(u, (u[l] = up(f, u, f, d))),
          Di(d) && Uu(c, u, d),
          null != s && Hu(u, d, a);
      }
      function Fn(e, t, n) {
        const r = v();
        return Oe(r, er(), t) && rt(W(), oe(), r, e, t, r[B], n, !1), Fn;
      }
      function tc(e, t, n, r, o) {
        const s = o ? "class" : "style";
        Yu(e, n, t.inputs[s], s, r);
      }
      function ie(e, t, n, r) {
        const o = v(),
          i = W(),
          s = re + e,
          a = o[B],
          u = i.firstCreatePass
            ? (function cS(e, t, n, r, o, i) {
                const s = t.consts,
                  u = mr(t, e, 2, r, cn(s, o));
                return (
                  Gu(t, n, u, cn(s, i)),
                  null !== u.attrs && Xi(u, u.attrs, !1),
                  null !== u.mergedAttrs && Xi(u, u.mergedAttrs, !0),
                  null !== t.queries && t.queries.elementStart(t, u),
                  u
                );
              })(s, i, o, t, n, r)
            : i.data[s],
          c = (o[s] = lu(
            a,
            t,
            (function CC() {
              return k.lFrame.currentNamespace;
            })()
          )),
          l = Di(u);
        return (
          Rt(u, !0),
          ch(a, c, u),
          32 != (32 & u.flags) && ki(i, o, c, u),
          0 ===
            (function iC() {
              return k.lFrame.elementDepthCount;
            })() && Ne(c, o),
          (function sC() {
            k.lFrame.elementDepthCount++;
          })(),
          l && (Uu(i, o, u), Bu(i, u, o)),
          null !== r && Hu(o, u),
          ie
        );
      }
      function le() {
        let e = Me();
        Na()
          ? (function Oa() {
              k.lFrame.isParent = !1;
            })()
          : ((e = e.parent), Rt(e, !1));
        const t = e;
        !(function aC() {
          k.lFrame.elementDepthCount--;
        })();
        const n = W();
        return (
          n.firstCreatePass && (_i(n, e), Ta(e) && n.queries.elementEnd(e)),
          null != t.classesWithoutHost &&
            (function bC(e) {
              return 0 != (8 & e.flags);
            })(t) &&
            tc(n, t, v(), t.classesWithoutHost, !0),
          null != t.stylesWithoutHost &&
            (function IC(e) {
              return 0 != (16 & e.flags);
            })(t) &&
            tc(n, t, v(), t.stylesWithoutHost, !1),
          le
        );
      }
      function Ir(e, t, n, r) {
        return ie(e, t, n, r), le(), Ir;
      }
      function oc() {
        return v();
      }
      function ns(e) {
        return !!e && "function" == typeof e.then;
      }
      const xp = function Rp(e) {
        return !!e && "function" == typeof e.subscribe;
      };
      function fn(e, t, n, r) {
        const o = v(),
          i = W(),
          s = Me();
        return (
          (function Np(e, t, n, r, o, i, s) {
            const a = Di(r),
              c = e.firstCreatePass && lp(e),
              l = t[ce],
              d = cp(t);
            let f = !0;
            if (3 & r.type || s) {
              const g = tt(r, t),
                y = s ? s(g) : g,
                D = d.length,
                _ = s ? (b) => s(Ie(b[r.index])) : r.index;
              let m = null;
              if (
                (!s &&
                  a &&
                  (m = (function dS(e, t, n, r) {
                    const o = e.cleanup;
                    if (null != o)
                      for (let i = 0; i < o.length - 1; i += 2) {
                        const s = o[i];
                        if (s === n && o[i + 1] === r) {
                          const a = t[Qn],
                            u = o[i + 2];
                          return a.length > u ? a[u] : null;
                        }
                        "string" == typeof s && (i += 2);
                      }
                    return null;
                  })(e, t, o, r.index)),
                null !== m)
              )
                ((m.__ngLastListenerFn__ || m).__ngNextListenerFn__ = i),
                  (m.__ngLastListenerFn__ = i),
                  (f = !1);
              else {
                i = Fp(r, t, l, i, !1);
                const b = n.listen(y, o, i);
                d.push(i, b), c && c.push(o, _, D, D + 1);
              }
            } else i = Fp(r, t, l, i, !1);
            const h = r.outputs;
            let p;
            if (f && null !== h && (p = h[o])) {
              const g = p.length;
              if (g)
                for (let y = 0; y < g; y += 2) {
                  const Z = t[p[y]][p[y + 1]].subscribe(i),
                    pe = d.length;
                  d.push(i, Z), c && c.push(o, r.index, pe, -(pe + 1));
                }
            }
          })(i, o, o[B], s, e, t, r),
          fn
        );
      }
      function Op(e, t, n, r) {
        try {
          return ut(6, t, n), !1 !== n(r);
        } catch (o) {
          return fp(e, o), !1;
        } finally {
          ut(7, t, n);
        }
      }
      function Fp(e, t, n, r, o) {
        return function i(s) {
          if (s === Function) return r;
          Yi(e.componentOffset > -1 ? We(e.index, t) : t);
          let u = Op(t, n, r, s),
            c = i.__ngNextListenerFn__;
          for (; c; ) (u = Op(t, n, c, s) && u), (c = c.__ngNextListenerFn__);
          return o && !1 === u && (s.preventDefault(), (s.returnValue = !1)), u;
        };
      }
      function rs(e = 1) {
        return (function gC(e) {
          return (k.lFrame.contextLView = (function mC(e, t) {
            for (; e > 0; ) (t = t[Yn]), e--;
            return t;
          })(e, k.lFrame.contextLView))[ce];
        })(e);
      }
      function ic(e, t, n) {
        return sc(e, "", t, "", n), ic;
      }
      function sc(e, t, n, r, o) {
        const i = v(),
          s = vr(i, t, n, r);
        return s !== L && rt(W(), oe(), i, e, s, i[B], o, !1), sc;
      }
      function Te(e, t = "") {
        const n = v(),
          r = W(),
          o = e + re,
          i = r.firstCreatePass ? mr(r, o, 1, t, null) : r.data[o],
          s = (n[o] = (function cu(e, t) {
            return e.createText(t);
          })(n[B], t));
        ki(r, n, s, i), Rt(i, !1);
      }
      function kt(e) {
        return dc("", e, ""), kt;
      }
      function dc(e, t, n) {
        const r = v(),
          o = vr(r, e, t, n);
        return o !== L && Xt(r, $e(), o), dc;
      }
      const Ar = "en-US";
      let Ig = Ar;
      class Rr {}
      class Xg {}
      class Jg extends Rr {
        constructor(t, n) {
          super(),
            (this._parent = n),
            (this._bootstrapComponents = []),
            (this.destroyCbs = []),
            (this.componentFactoryResolver = new hp(this));
          const r = Je(t);
          (this._bootstrapComponents = Yt(r.bootstrap)),
            (this._r3Injector = Wh(
              t,
              n,
              [
                { provide: Rr, useValue: this },
                { provide: Do, useValue: this.componentFactoryResolver },
              ],
              ee(t),
              new Set(["environment"])
            )),
            this._r3Injector.resolveInjectorInitializers(),
            (this.instance = this._r3Injector.get(t));
        }
        get injector() {
          return this._r3Injector;
        }
        destroy() {
          const t = this._r3Injector;
          !t.destroyed && t.destroy(),
            this.destroyCbs.forEach((n) => n()),
            (this.destroyCbs = null);
        }
        onDestroy(t) {
          this.destroyCbs.push(t);
        }
      }
      class vc extends Xg {
        constructor(t) {
          super(), (this.moduleType = t);
        }
        create(t) {
          return new Jg(this.moduleType, t);
        }
      }
      class rI extends Rr {
        constructor(t, n, r) {
          super(),
            (this.componentFactoryResolver = new hp(this)),
            (this.instance = null);
          const o = new Rh(
            [
              ...t,
              { provide: Rr, useValue: this },
              { provide: Do, useValue: this.componentFactoryResolver },
            ],
            n || Hi(),
            r,
            new Set(["environment"])
          );
          (this.injector = o), o.resolveInjectorInitializers();
        }
        destroy() {
          this.injector.destroy();
        }
        onDestroy(t) {
          this.injector.onDestroy(t);
        }
      }
      function ls(e, t, n = null) {
        return new rI(e, t, n).injector;
      }
      let oI = (() => {
        class e {
          constructor(n) {
            (this._injector = n), (this.cachedInjectors = new Map());
          }
          getOrCreateStandaloneInjector(n) {
            if (!n.standalone) return null;
            if (!this.cachedInjectors.has(n.id)) {
              const r = Ih(0, n.type),
                o =
                  r.length > 0
                    ? ls([r], this._injector, `Standalone[${n.type.name}]`)
                    : null;
              this.cachedInjectors.set(n.id, o);
            }
            return this.cachedInjectors.get(n.id);
          }
          ngOnDestroy() {
            try {
              for (const n of this.cachedInjectors.values())
                null !== n && n.destroy();
            } finally {
              this.cachedInjectors.clear();
            }
          }
        }
        return (
          (e.ɵprov = P({
            token: e,
            providedIn: "environment",
            factory: () => new e(x(Qt)),
          })),
          e
        );
      })();
      function em(e) {
        e.getStandaloneInjector = (t) =>
          t.get(oI).getOrCreateStandaloneInjector(e);
      }
      function wc(e) {
        return (t) => {
          setTimeout(e, void 0, t);
        };
      }
      const Be = class RI extends Vt {
        constructor(t = !1) {
          super(), (this.__isAsync = t);
        }
        emit(t) {
          super.next(t);
        }
        subscribe(t, n, r) {
          let o = t,
            i = n || (() => null),
            s = r;
          if (t && "object" == typeof t) {
            const u = t;
            (o = u.next?.bind(u)),
              (i = u.error?.bind(u)),
              (s = u.complete?.bind(u));
          }
          this.__isAsync && ((i = wc(i)), o && (o = wc(o)), s && (s = wc(s)));
          const a = super.subscribe({ next: o, error: i, complete: s });
          return t instanceof it && t.add(a), a;
        }
      };
      let Jt = (() => {
        class e {}
        return (e.__NG_ELEMENT_ID__ = OI), e;
      })();
      const PI = Jt,
        NI = class extends PI {
          constructor(t, n, r) {
            super(),
              (this._declarationLView = t),
              (this._declarationTContainer = n),
              (this.elementRef = r);
          }
          createEmbeddedView(t, n) {
            const r = this._declarationTContainer.tView,
              o = qi(
                this._declarationLView,
                r,
                t,
                16,
                null,
                r.declTNode,
                null,
                null,
                null,
                null,
                n || null
              );
            o[Jr] = this._declarationLView[this._declarationTContainer.index];
            const s = this._declarationLView[At];
            return (
              null !== s && (o[At] = s.createEmbeddedView(r)),
              Vu(r, o, t),
              new Co(o)
            );
          }
        };
      function OI() {
        return (function ds(e, t) {
          return 4 & e.type ? new NI(t, e, fr(e, t)) : null;
        })(Me(), v());
      }
      let wt = (() => {
        class e {}
        return (e.__NG_ELEMENT_ID__ = FI), e;
      })();
      function FI() {
        return (function pm(e, t) {
          let n;
          const r = t[e.index];
          if (gt(r)) n = r;
          else {
            let o;
            if (8 & e.type) o = Ie(r);
            else {
              const i = t[B];
              o = i.createComment("");
              const s = tt(e, t);
              Pn(
                i,
                Fi(i, s),
                o,
                (function A_(e, t) {
                  return e.nextSibling(t);
                })(i, s),
                !1
              );
            }
            (t[e.index] = n = up(r, t, o, e)), Qi(t, n);
          }
          return new fm(n, e, t);
        })(Me(), v());
      }
      const kI = wt,
        fm = class extends kI {
          constructor(t, n, r) {
            super(),
              (this._lContainer = t),
              (this._hostTNode = n),
              (this._hostLView = r);
          }
          get element() {
            return fr(this._hostTNode, this._hostLView);
          }
          get injector() {
            return new nr(this._hostTNode, this._hostLView);
          }
          get parentInjector() {
            const t = Ga(this._hostTNode, this._hostLView);
            if (pf(t)) {
              const n = Ii(t, this._hostLView),
                r = bi(t);
              return new nr(n[E].data[r + 8], n);
            }
            return new nr(null, this._hostLView);
          }
          clear() {
            for (; this.length > 0; ) this.remove(this.length - 1);
          }
          get(t) {
            const n = hm(this._lContainer);
            return (null !== n && n[t]) || null;
          }
          get length() {
            return this._lContainer.length - Le;
          }
          createEmbeddedView(t, n, r) {
            let o, i;
            "number" == typeof r
              ? (o = r)
              : null != r && ((o = r.index), (i = r.injector));
            const s = t.createEmbeddedView(n || {}, i);
            return this.insert(s, o), s;
          }
          createComponent(t, n, r, o, i) {
            const s =
              t &&
              !(function so(e) {
                return "function" == typeof e;
              })(t);
            let a;
            if (s) a = n;
            else {
              const d = n || {};
              (a = d.index),
                (r = d.injector),
                (o = d.projectableNodes),
                (i = d.environmentInjector || d.ngModuleRef);
            }
            const u = s ? t : new _o(K(t)),
              c = r || this.parentInjector;
            if (!i && null == u.ngModule) {
              const f = (s ? c : this.parentInjector).get(Qt, null);
              f && (i = f);
            }
            const l = u.create(c, o, void 0, i);
            return this.insert(l.hostView, a), l;
          }
          insert(t, n) {
            const r = t._lView,
              o = r[E];
            if (
              (function oC(e) {
                return gt(e[ae]);
              })(r)
            ) {
              const l = this.indexOf(t);
              if (-1 !== l) this.detach(l);
              else {
                const d = r[ae],
                  f = new fm(d, d[xe], d[ae]);
                f.detach(f.indexOf(t));
              }
            }
            const i = this._adjustIndex(n),
              s = this._lContainer;
            !(function S_(e, t, n, r) {
              const o = Le + r,
                i = n.length;
              r > 0 && (n[o - 1][pt] = t),
                r < i - Le
                  ? ((t[pt] = n[o]), Mf(n, Le + r, t))
                  : (n.push(t), (t[pt] = null)),
                (t[ae] = n);
              const s = t[Jr];
              null !== s &&
                n !== s &&
                (function b_(e, t) {
                  const n = e[Xn];
                  t[Pe] !== t[ae][ae][Pe] && (e[Vd] = !0),
                    null === n ? (e[Xn] = [t]) : n.push(t);
                })(s, t);
              const a = t[At];
              null !== a && a.insertView(e), (t[$] |= 64);
            })(o, r, s, i);
            const a = pu(i, s),
              u = r[B],
              c = Fi(u, s[yi]);
            return (
              null !== c &&
                (function C_(e, t, n, r, o, i) {
                  (r[Gt] = o), (r[xe] = t), go(e, r, n, 1, o, i);
                })(o, s[xe], u, r, c, a),
              t.attachToViewContainerRef(),
              Mf(_c(s), i, t),
              t
            );
          }
          move(t, n) {
            return this.insert(t, n);
          }
          indexOf(t) {
            const n = hm(this._lContainer);
            return null !== n ? n.indexOf(t) : -1;
          }
          remove(t) {
            const n = this._adjustIndex(t, -1),
              r = du(this._lContainer, n);
            r && (xi(_c(this._lContainer), n), Kf(r[E], r));
          }
          detach(t) {
            const n = this._adjustIndex(t, -1),
              r = du(this._lContainer, n);
            return r && null != xi(_c(this._lContainer), n) ? new Co(r) : null;
          }
          _adjustIndex(t, n = 0) {
            return t ?? this.length + n;
          }
        };
      function hm(e) {
        return e[vi];
      }
      function _c(e) {
        return e[vi] || (e[vi] = []);
      }
      function hs(...e) {}
      const ps = new N("Application Initializer");
      let gs = (() => {
        class e {
          constructor(n) {
            (this.appInits = n),
              (this.resolve = hs),
              (this.reject = hs),
              (this.initialized = !1),
              (this.done = !1),
              (this.donePromise = new Promise((r, o) => {
                (this.resolve = r), (this.reject = o);
              }));
          }
          runInitializers() {
            if (this.initialized) return;
            const n = [],
              r = () => {
                (this.done = !0), this.resolve();
              };
            if (this.appInits)
              for (let o = 0; o < this.appInits.length; o++) {
                const i = this.appInits[o]();
                if (ns(i)) n.push(i);
                else if (xp(i)) {
                  const s = new Promise((a, u) => {
                    i.subscribe({ complete: a, error: u });
                  });
                  n.push(s);
                }
              }
            Promise.all(n)
              .then(() => {
                r();
              })
              .catch((o) => {
                this.reject(o);
              }),
              0 === n.length && r(),
              (this.initialized = !0);
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(x(ps, 8));
          }),
          (e.ɵprov = P({ token: e, factory: e.ɵfac, providedIn: "root" })),
          e
        );
      })();
      const No = new N("AppId", {
        providedIn: "root",
        factory: function Vm() {
          return `${Nc()}${Nc()}${Nc()}`;
        },
      });
      function Nc() {
        return String.fromCharCode(97 + Math.floor(25 * Math.random()));
      }
      const Bm = new N("Platform Initializer"),
        Um = new N("Platform ID", {
          providedIn: "platform",
          factory: () => "unknown",
        });
      let lM = (() => {
        class e {
          log(n) {
            console.log(n);
          }
          warn(n) {
            console.warn(n);
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)();
          }),
          (e.ɵprov = P({ token: e, factory: e.ɵfac, providedIn: "platform" })),
          e
        );
      })();
      const en = new N("LocaleId", {
        providedIn: "root",
        factory: () =>
          H(en, R.Optional | R.SkipSelf) ||
          (function dM() {
            return (typeof $localize < "u" && $localize.locale) || Ar;
          })(),
      });
      class hM {
        constructor(t, n) {
          (this.ngModuleFactory = t), (this.componentFactories = n);
        }
      }
      let Hm = (() => {
        class e {
          compileModuleSync(n) {
            return new vc(n);
          }
          compileModuleAsync(n) {
            return Promise.resolve(this.compileModuleSync(n));
          }
          compileModuleAndAllComponentsSync(n) {
            const r = this.compileModuleSync(n),
              i = Yt(Je(n).declarations).reduce((s, a) => {
                const u = K(a);
                return u && s.push(new _o(u)), s;
              }, []);
            return new hM(r, i);
          }
          compileModuleAndAllComponentsAsync(n) {
            return Promise.resolve(this.compileModuleAndAllComponentsSync(n));
          }
          clearCache() {}
          clearCacheFor(n) {}
          getModuleId(n) {}
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)();
          }),
          (e.ɵprov = P({ token: e, factory: e.ɵfac, providedIn: "root" })),
          e
        );
      })();
      const mM = (() => Promise.resolve(0))();
      function Oc(e) {
        typeof Zone > "u"
          ? mM.then(() => {
              e && e.apply(null, null);
            })
          : Zone.current.scheduleMicroTask("scheduleMicrotask", e);
      }
      class de {
        constructor({
          enableLongStackTrace: t = !1,
          shouldCoalesceEventChangeDetection: n = !1,
          shouldCoalesceRunChangeDetection: r = !1,
        }) {
          if (
            ((this.hasPendingMacrotasks = !1),
            (this.hasPendingMicrotasks = !1),
            (this.isStable = !0),
            (this.onUnstable = new Be(!1)),
            (this.onMicrotaskEmpty = new Be(!1)),
            (this.onStable = new Be(!1)),
            (this.onError = new Be(!1)),
            typeof Zone > "u")
          )
            throw new w(908, !1);
          Zone.assertZonePatched();
          const o = this;
          (o._nesting = 0),
            (o._outer = o._inner = Zone.current),
            Zone.TaskTrackingZoneSpec &&
              (o._inner = o._inner.fork(new Zone.TaskTrackingZoneSpec())),
            t &&
              Zone.longStackTraceZoneSpec &&
              (o._inner = o._inner.fork(Zone.longStackTraceZoneSpec)),
            (o.shouldCoalesceEventChangeDetection = !r && n),
            (o.shouldCoalesceRunChangeDetection = r),
            (o.lastRequestAnimationFrameId = -1),
            (o.nativeRequestAnimationFrame = (function yM() {
              let e = ne.requestAnimationFrame,
                t = ne.cancelAnimationFrame;
              if (typeof Zone < "u" && e && t) {
                const n = e[Zone.__symbol__("OriginalDelegate")];
                n && (e = n);
                const r = t[Zone.__symbol__("OriginalDelegate")];
                r && (t = r);
              }
              return {
                nativeRequestAnimationFrame: e,
                nativeCancelAnimationFrame: t,
              };
            })().nativeRequestAnimationFrame),
            (function wM(e) {
              const t = () => {
                !(function DM(e) {
                  e.isCheckStableRunning ||
                    -1 !== e.lastRequestAnimationFrameId ||
                    ((e.lastRequestAnimationFrameId =
                      e.nativeRequestAnimationFrame.call(ne, () => {
                        e.fakeTopEventTask ||
                          (e.fakeTopEventTask = Zone.root.scheduleEventTask(
                            "fakeTopEventTask",
                            () => {
                              (e.lastRequestAnimationFrameId = -1),
                                kc(e),
                                (e.isCheckStableRunning = !0),
                                Fc(e),
                                (e.isCheckStableRunning = !1);
                            },
                            void 0,
                            () => {},
                            () => {}
                          )),
                          e.fakeTopEventTask.invoke();
                      })),
                    kc(e));
                })(e);
              };
              e._inner = e._inner.fork({
                name: "angular",
                properties: { isAngularZone: !0 },
                onInvokeTask: (n, r, o, i, s, a) => {
                  try {
                    return Wm(e), n.invokeTask(o, i, s, a);
                  } finally {
                    ((e.shouldCoalesceEventChangeDetection &&
                      "eventTask" === i.type) ||
                      e.shouldCoalesceRunChangeDetection) &&
                      t(),
                      qm(e);
                  }
                },
                onInvoke: (n, r, o, i, s, a, u) => {
                  try {
                    return Wm(e), n.invoke(o, i, s, a, u);
                  } finally {
                    e.shouldCoalesceRunChangeDetection && t(), qm(e);
                  }
                },
                onHasTask: (n, r, o, i) => {
                  n.hasTask(o, i),
                    r === o &&
                      ("microTask" == i.change
                        ? ((e._hasPendingMicrotasks = i.microTask),
                          kc(e),
                          Fc(e))
                        : "macroTask" == i.change &&
                          (e.hasPendingMacrotasks = i.macroTask));
                },
                onHandleError: (n, r, o, i) => (
                  n.handleError(o, i),
                  e.runOutsideAngular(() => e.onError.emit(i)),
                  !1
                ),
              });
            })(o);
        }
        static isInAngularZone() {
          return typeof Zone < "u" && !0 === Zone.current.get("isAngularZone");
        }
        static assertInAngularZone() {
          if (!de.isInAngularZone()) throw new w(909, !1);
        }
        static assertNotInAngularZone() {
          if (de.isInAngularZone()) throw new w(909, !1);
        }
        run(t, n, r) {
          return this._inner.run(t, n, r);
        }
        runTask(t, n, r, o) {
          const i = this._inner,
            s = i.scheduleEventTask("NgZoneEvent: " + o, t, vM, hs, hs);
          try {
            return i.runTask(s, n, r);
          } finally {
            i.cancelTask(s);
          }
        }
        runGuarded(t, n, r) {
          return this._inner.runGuarded(t, n, r);
        }
        runOutsideAngular(t) {
          return this._outer.run(t);
        }
      }
      const vM = {};
      function Fc(e) {
        if (0 == e._nesting && !e.hasPendingMicrotasks && !e.isStable)
          try {
            e._nesting++, e.onMicrotaskEmpty.emit(null);
          } finally {
            if ((e._nesting--, !e.hasPendingMicrotasks))
              try {
                e.runOutsideAngular(() => e.onStable.emit(null));
              } finally {
                e.isStable = !0;
              }
          }
      }
      function kc(e) {
        e.hasPendingMicrotasks = !!(
          e._hasPendingMicrotasks ||
          ((e.shouldCoalesceEventChangeDetection ||
            e.shouldCoalesceRunChangeDetection) &&
            -1 !== e.lastRequestAnimationFrameId)
        );
      }
      function Wm(e) {
        e._nesting++,
          e.isStable && ((e.isStable = !1), e.onUnstable.emit(null));
      }
      function qm(e) {
        e._nesting--, Fc(e);
      }
      class CM {
        constructor() {
          (this.hasPendingMicrotasks = !1),
            (this.hasPendingMacrotasks = !1),
            (this.isStable = !0),
            (this.onUnstable = new Be()),
            (this.onMicrotaskEmpty = new Be()),
            (this.onStable = new Be()),
            (this.onError = new Be());
        }
        run(t, n, r) {
          return t.apply(n, r);
        }
        runGuarded(t, n, r) {
          return t.apply(n, r);
        }
        runOutsideAngular(t) {
          return t();
        }
        runTask(t, n, r, o) {
          return t.apply(n, r);
        }
      }
      const Zm = new N(""),
        ms = new N("");
      let $c,
        Lc = (() => {
          class e {
            constructor(n, r, o) {
              (this._ngZone = n),
                (this.registry = r),
                (this._pendingCount = 0),
                (this._isZoneStable = !0),
                (this._didWork = !1),
                (this._callbacks = []),
                (this.taskTrackingZone = null),
                $c ||
                  ((function _M(e) {
                    $c = e;
                  })(o),
                  o.addToWindow(r)),
                this._watchAngularEvents(),
                n.run(() => {
                  this.taskTrackingZone =
                    typeof Zone > "u"
                      ? null
                      : Zone.current.get("TaskTrackingZone");
                });
            }
            _watchAngularEvents() {
              this._ngZone.onUnstable.subscribe({
                next: () => {
                  (this._didWork = !0), (this._isZoneStable = !1);
                },
              }),
                this._ngZone.runOutsideAngular(() => {
                  this._ngZone.onStable.subscribe({
                    next: () => {
                      de.assertNotInAngularZone(),
                        Oc(() => {
                          (this._isZoneStable = !0),
                            this._runCallbacksIfReady();
                        });
                    },
                  });
                });
            }
            increasePendingRequestCount() {
              return (
                (this._pendingCount += 1),
                (this._didWork = !0),
                this._pendingCount
              );
            }
            decreasePendingRequestCount() {
              if (((this._pendingCount -= 1), this._pendingCount < 0))
                throw new Error("pending async requests below zero");
              return this._runCallbacksIfReady(), this._pendingCount;
            }
            isStable() {
              return (
                this._isZoneStable &&
                0 === this._pendingCount &&
                !this._ngZone.hasPendingMacrotasks
              );
            }
            _runCallbacksIfReady() {
              if (this.isStable())
                Oc(() => {
                  for (; 0 !== this._callbacks.length; ) {
                    let n = this._callbacks.pop();
                    clearTimeout(n.timeoutId), n.doneCb(this._didWork);
                  }
                  this._didWork = !1;
                });
              else {
                let n = this.getPendingTasks();
                (this._callbacks = this._callbacks.filter(
                  (r) =>
                    !r.updateCb ||
                    !r.updateCb(n) ||
                    (clearTimeout(r.timeoutId), !1)
                )),
                  (this._didWork = !0);
              }
            }
            getPendingTasks() {
              return this.taskTrackingZone
                ? this.taskTrackingZone.macroTasks.map((n) => ({
                    source: n.source,
                    creationLocation: n.creationLocation,
                    data: n.data,
                  }))
                : [];
            }
            addCallback(n, r, o) {
              let i = -1;
              r &&
                r > 0 &&
                (i = setTimeout(() => {
                  (this._callbacks = this._callbacks.filter(
                    (s) => s.timeoutId !== i
                  )),
                    n(this._didWork, this.getPendingTasks());
                }, r)),
                this._callbacks.push({ doneCb: n, timeoutId: i, updateCb: o });
            }
            whenStable(n, r, o) {
              if (o && !this.taskTrackingZone)
                throw new Error(
                  'Task tracking zone is required when passing an update callback to whenStable(). Is "zone.js/plugins/task-tracking" loaded?'
                );
              this.addCallback(n, r, o), this._runCallbacksIfReady();
            }
            getPendingRequestCount() {
              return this._pendingCount;
            }
            registerApplication(n) {
              this.registry.registerApplication(n, this);
            }
            unregisterApplication(n) {
              this.registry.unregisterApplication(n);
            }
            findProviders(n, r, o) {
              return [];
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)(x(de), x(jc), x(ms));
            }),
            (e.ɵprov = P({ token: e, factory: e.ɵfac })),
            e
          );
        })(),
        jc = (() => {
          class e {
            constructor() {
              this._applications = new Map();
            }
            registerApplication(n, r) {
              this._applications.set(n, r);
            }
            unregisterApplication(n) {
              this._applications.delete(n);
            }
            unregisterAllApplications() {
              this._applications.clear();
            }
            getTestability(n) {
              return this._applications.get(n) || null;
            }
            getAllTestabilities() {
              return Array.from(this._applications.values());
            }
            getAllRootElements() {
              return Array.from(this._applications.keys());
            }
            findTestabilityInTree(n, r = !0) {
              return $c?.findTestabilityInTree(this, n, r) ?? null;
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)();
            }),
            (e.ɵprov = P({
              token: e,
              factory: e.ɵfac,
              providedIn: "platform",
            })),
            e
          );
        })();
      const tn = !1;
      let pn = null;
      const Qm = new N("AllowMultipleToken"),
        Vc = new N("PlatformDestroyListeners"),
        Ym = new N("appBootstrapListener");
      class Km {
        constructor(t, n) {
          (this.name = t), (this.token = n);
        }
      }
      function Jm(e, t, n = []) {
        const r = `Platform: ${t}`,
          o = new N(r);
        return (i = []) => {
          let s = Bc();
          if (!s || s.injector.get(Qm, !1)) {
            const a = [...n, ...i, { provide: o, useValue: !0 }];
            e
              ? e(a)
              : (function bM(e) {
                  if (pn && !pn.get(Qm, !1)) throw new w(400, !1);
                  pn = e;
                  const t = e.get(ty);
                  (function Xm(e) {
                    const t = e.get(Bm, null);
                    t && t.forEach((n) => n());
                  })(e);
                })(
                  (function ey(e = [], t) {
                    return Kt.create({
                      name: t,
                      providers: [
                        { provide: Tu, useValue: "platform" },
                        { provide: Vc, useValue: new Set([() => (pn = null)]) },
                        ...e,
                      ],
                    });
                  })(a, r)
                );
          }
          return (function MM(e) {
            const t = Bc();
            if (!t) throw new w(401, !1);
            return t;
          })();
        };
      }
      function Bc() {
        return pn?.get(ty) ?? null;
      }
      let ty = (() => {
        class e {
          constructor(n) {
            (this._injector = n),
              (this._modules = []),
              (this._destroyListeners = []),
              (this._destroyed = !1);
          }
          bootstrapModuleFactory(n, r) {
            const o = (function ry(e, t) {
                let n;
                return (
                  (n =
                    "noop" === e
                      ? new CM()
                      : ("zone.js" === e ? void 0 : e) || new de(t)),
                  n
                );
              })(
                r?.ngZone,
                (function ny(e) {
                  return {
                    enableLongStackTrace: !1,
                    shouldCoalesceEventChangeDetection:
                      !(!e || !e.ngZoneEventCoalescing) || !1,
                    shouldCoalesceRunChangeDetection:
                      !(!e || !e.ngZoneRunCoalescing) || !1,
                  };
                })(r)
              ),
              i = [{ provide: de, useValue: o }];
            return o.run(() => {
              const s = Kt.create({
                  providers: i,
                  parent: this.injector,
                  name: n.moduleType.name,
                }),
                a = n.create(s),
                u = a.injector.get(hr, null);
              if (!u) throw new w(402, !1);
              return (
                o.runOutsideAngular(() => {
                  const c = o.onError.subscribe({
                    next: (l) => {
                      u.handleError(l);
                    },
                  });
                  a.onDestroy(() => {
                    vs(this._modules, a), c.unsubscribe();
                  });
                }),
                (function oy(e, t, n) {
                  try {
                    const r = n();
                    return ns(r)
                      ? r.catch((o) => {
                          throw (
                            (t.runOutsideAngular(() => e.handleError(o)), o)
                          );
                        })
                      : r;
                  } catch (r) {
                    throw (t.runOutsideAngular(() => e.handleError(r)), r);
                  }
                })(u, o, () => {
                  const c = a.injector.get(gs);
                  return (
                    c.runInitializers(),
                    c.donePromise.then(
                      () => (
                        (function Mg(e) {
                          st(e, "Expected localeId to be defined"),
                            "string" == typeof e &&
                              (Ig = e.toLowerCase().replace(/_/g, "-"));
                        })(a.injector.get(en, Ar) || Ar),
                        this._moduleDoBootstrap(a),
                        a
                      )
                    )
                  );
                })
              );
            });
          }
          bootstrapModule(n, r = []) {
            const o = iy({}, r);
            return (function EM(e, t, n) {
              const r = new vc(n);
              return Promise.resolve(r);
            })(0, 0, n).then((i) => this.bootstrapModuleFactory(i, o));
          }
          _moduleDoBootstrap(n) {
            const r = n.injector.get(ys);
            if (n._bootstrapComponents.length > 0)
              n._bootstrapComponents.forEach((o) => r.bootstrap(o));
            else {
              if (!n.instance.ngDoBootstrap) throw new w(-403, !1);
              n.instance.ngDoBootstrap(r);
            }
            this._modules.push(n);
          }
          onDestroy(n) {
            this._destroyListeners.push(n);
          }
          get injector() {
            return this._injector;
          }
          destroy() {
            if (this._destroyed) throw new w(404, !1);
            this._modules.slice().forEach((r) => r.destroy()),
              this._destroyListeners.forEach((r) => r());
            const n = this._injector.get(Vc, null);
            n && (n.forEach((r) => r()), n.clear()), (this._destroyed = !0);
          }
          get destroyed() {
            return this._destroyed;
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(x(Kt));
          }),
          (e.ɵprov = P({ token: e, factory: e.ɵfac, providedIn: "platform" })),
          e
        );
      })();
      function iy(e, t) {
        return Array.isArray(t) ? t.reduce(iy, e) : { ...e, ...t };
      }
      let ys = (() => {
        class e {
          get destroyed() {
            return this._destroyed;
          }
          get injector() {
            return this._injector;
          }
          constructor(n, r, o) {
            (this._zone = n),
              (this._injector = r),
              (this._exceptionHandler = o),
              (this._bootstrapListeners = []),
              (this._views = []),
              (this._runningTick = !1),
              (this._stable = !0),
              (this._destroyed = !1),
              (this._destroyListeners = []),
              (this.componentTypes = []),
              (this.components = []),
              (this._onMicrotaskEmptySubscription =
                this._zone.onMicrotaskEmpty.subscribe({
                  next: () => {
                    this._zone.run(() => {
                      this.tick();
                    });
                  },
                }));
            const i = new ve((a) => {
                (this._stable =
                  this._zone.isStable &&
                  !this._zone.hasPendingMacrotasks &&
                  !this._zone.hasPendingMicrotasks),
                  this._zone.runOutsideAngular(() => {
                    a.next(this._stable), a.complete();
                  });
              }),
              s = new ve((a) => {
                let u;
                this._zone.runOutsideAngular(() => {
                  u = this._zone.onStable.subscribe(() => {
                    de.assertNotInAngularZone(),
                      Oc(() => {
                        !this._stable &&
                          !this._zone.hasPendingMacrotasks &&
                          !this._zone.hasPendingMicrotasks &&
                          ((this._stable = !0), a.next(!0));
                      });
                  });
                });
                const c = this._zone.onUnstable.subscribe(() => {
                  de.assertInAngularZone(),
                    this._stable &&
                      ((this._stable = !1),
                      this._zone.runOutsideAngular(() => {
                        a.next(!1);
                      }));
                });
                return () => {
                  u.unsubscribe(), c.unsubscribe();
                };
              });
            this.isStable = (function Ew(...e) {
              const t = Wr(e),
                n = (function mw(e, t) {
                  return "number" == typeof ha(e) ? e.pop() : t;
                })(e, 1 / 0),
                r = e;
              return r.length
                ? 1 === r.length
                  ? bt(r[0])
                  : Wn(n)(De(r, t))
                : It;
            })(
              i,
              s.pipe(
                (function Sw(e = {}) {
                  const {
                    connector: t = () => new Vt(),
                    resetOnError: n = !0,
                    resetOnComplete: r = !0,
                    resetOnRefCountZero: o = !0,
                  } = e;
                  return (i) => {
                    let s,
                      a,
                      u,
                      c = 0,
                      l = !1,
                      d = !1;
                    const f = () => {
                        a?.unsubscribe(), (a = void 0);
                      },
                      h = () => {
                        f(), (s = u = void 0), (l = d = !1);
                      },
                      p = () => {
                        const g = s;
                        h(), g?.unsubscribe();
                      };
                    return Ee((g, y) => {
                      c++, !d && !l && f();
                      const D = (u = u ?? t());
                      y.add(() => {
                        c--, 0 === c && !d && !l && (a = pa(p, o));
                      }),
                        D.subscribe(y),
                        !s &&
                          c > 0 &&
                          ((s = new Gr({
                            next: (_) => D.next(_),
                            error: (_) => {
                              (d = !0), f(), (a = pa(h, n, _)), D.error(_);
                            },
                            complete: () => {
                              (l = !0), f(), (a = pa(h, r)), D.complete();
                            },
                          })),
                          bt(g).subscribe(s));
                    })(i);
                  };
                })()
              )
            );
          }
          bootstrap(n, r) {
            const o = n instanceof Ph;
            if (!this._injector.get(gs).done) {
              !o &&
                (function Zn(e) {
                  const t = K(e) || Re(e) || Ge(e);
                  return null !== t && t.standalone;
                })(n);
              throw new w(405, tn);
            }
            let s;
            (s = o ? n : this._injector.get(Do).resolveComponentFactory(n)),
              this.componentTypes.push(s.componentType);
            const a = (function SM(e) {
                return e.isBoundToModule;
              })(s)
                ? void 0
                : this._injector.get(Rr),
              c = s.create(Kt.NULL, [], r || s.selector, a),
              l = c.location.nativeElement,
              d = c.injector.get(Zm, null);
            return (
              d?.registerApplication(l),
              c.onDestroy(() => {
                this.detachView(c.hostView),
                  vs(this.components, c),
                  d?.unregisterApplication(l);
              }),
              this._loadComponent(c),
              c
            );
          }
          tick() {
            if (this._runningTick) throw new w(101, !1);
            try {
              this._runningTick = !0;
              for (let n of this._views) n.detectChanges();
            } catch (n) {
              this._zone.runOutsideAngular(() =>
                this._exceptionHandler.handleError(n)
              );
            } finally {
              this._runningTick = !1;
            }
          }
          attachView(n) {
            const r = n;
            this._views.push(r), r.attachToAppRef(this);
          }
          detachView(n) {
            const r = n;
            vs(this._views, r), r.detachFromAppRef();
          }
          _loadComponent(n) {
            this.attachView(n.hostView), this.tick(), this.components.push(n);
            const r = this._injector.get(Ym, []);
            r.push(...this._bootstrapListeners), r.forEach((o) => o(n));
          }
          ngOnDestroy() {
            if (!this._destroyed)
              try {
                this._destroyListeners.forEach((n) => n()),
                  this._views.slice().forEach((n) => n.destroy()),
                  this._onMicrotaskEmptySubscription.unsubscribe();
              } finally {
                (this._destroyed = !0),
                  (this._views = []),
                  (this._bootstrapListeners = []),
                  (this._destroyListeners = []);
              }
          }
          onDestroy(n) {
            return (
              this._destroyListeners.push(n),
              () => vs(this._destroyListeners, n)
            );
          }
          destroy() {
            if (this._destroyed) throw new w(406, !1);
            const n = this._injector;
            n.destroy && !n.destroyed && n.destroy();
          }
          get viewCount() {
            return this._views.length;
          }
          warnIfDestroyed() {}
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(x(de), x(Qt), x(hr));
          }),
          (e.ɵprov = P({ token: e, factory: e.ɵfac, providedIn: "root" })),
          e
        );
      })();
      function vs(e, t) {
        const n = e.indexOf(t);
        n > -1 && e.splice(n, 1);
      }
      let Uc = (() => {
        class e {}
        return (e.__NG_ELEMENT_ID__ = AM), e;
      })();
      function AM(e) {
        return (function RM(e, t, n) {
          if (to(e) && !n) {
            const r = We(e.index, t);
            return new Co(r, r);
          }
          return 47 & e.type ? new Co(t[Pe], t) : null;
        })(Me(), v(), 16 == (16 & e));
      }
      class ly {
        constructor() {}
        supports(t) {
          return es(t);
        }
        create(t) {
          return new kM(t);
        }
      }
      const FM = (e, t) => t;
      class kM {
        constructor(t) {
          (this.length = 0),
            (this._linkedRecords = null),
            (this._unlinkedRecords = null),
            (this._previousItHead = null),
            (this._itHead = null),
            (this._itTail = null),
            (this._additionsHead = null),
            (this._additionsTail = null),
            (this._movesHead = null),
            (this._movesTail = null),
            (this._removalsHead = null),
            (this._removalsTail = null),
            (this._identityChangesHead = null),
            (this._identityChangesTail = null),
            (this._trackByFn = t || FM);
        }
        forEachItem(t) {
          let n;
          for (n = this._itHead; null !== n; n = n._next) t(n);
        }
        forEachOperation(t) {
          let n = this._itHead,
            r = this._removalsHead,
            o = 0,
            i = null;
          for (; n || r; ) {
            const s = !r || (n && n.currentIndex < fy(r, o, i)) ? n : r,
              a = fy(s, o, i),
              u = s.currentIndex;
            if (s === r) o--, (r = r._nextRemoved);
            else if (((n = n._next), null == s.previousIndex)) o++;
            else {
              i || (i = []);
              const c = a - o,
                l = u - o;
              if (c != l) {
                for (let f = 0; f < c; f++) {
                  const h = f < i.length ? i[f] : (i[f] = 0),
                    p = h + f;
                  l <= p && p < c && (i[f] = h + 1);
                }
                i[s.previousIndex] = l - c;
              }
            }
            a !== u && t(s, a, u);
          }
        }
        forEachPreviousItem(t) {
          let n;
          for (n = this._previousItHead; null !== n; n = n._nextPrevious) t(n);
        }
        forEachAddedItem(t) {
          let n;
          for (n = this._additionsHead; null !== n; n = n._nextAdded) t(n);
        }
        forEachMovedItem(t) {
          let n;
          for (n = this._movesHead; null !== n; n = n._nextMoved) t(n);
        }
        forEachRemovedItem(t) {
          let n;
          for (n = this._removalsHead; null !== n; n = n._nextRemoved) t(n);
        }
        forEachIdentityChange(t) {
          let n;
          for (
            n = this._identityChangesHead;
            null !== n;
            n = n._nextIdentityChange
          )
            t(n);
        }
        diff(t) {
          if ((null == t && (t = []), !es(t))) throw new w(900, !1);
          return this.check(t) ? this : null;
        }
        onDestroy() {}
        check(t) {
          this._reset();
          let o,
            i,
            s,
            n = this._itHead,
            r = !1;
          if (Array.isArray(t)) {
            this.length = t.length;
            for (let a = 0; a < this.length; a++)
              (i = t[a]),
                (s = this._trackByFn(a, i)),
                null !== n && Object.is(n.trackById, s)
                  ? (r && (n = this._verifyReinsertion(n, i, s, a)),
                    Object.is(n.item, i) || this._addIdentityChange(n, i))
                  : ((n = this._mismatch(n, i, s, a)), (r = !0)),
                (n = n._next);
          } else
            (o = 0),
              (function rS(e, t) {
                if (Array.isArray(e))
                  for (let n = 0; n < e.length; n++) t(e[n]);
                else {
                  const n = e[Symbol.iterator]();
                  let r;
                  for (; !(r = n.next()).done; ) t(r.value);
                }
              })(t, (a) => {
                (s = this._trackByFn(o, a)),
                  null !== n && Object.is(n.trackById, s)
                    ? (r && (n = this._verifyReinsertion(n, a, s, o)),
                      Object.is(n.item, a) || this._addIdentityChange(n, a))
                    : ((n = this._mismatch(n, a, s, o)), (r = !0)),
                  (n = n._next),
                  o++;
              }),
              (this.length = o);
          return this._truncate(n), (this.collection = t), this.isDirty;
        }
        get isDirty() {
          return (
            null !== this._additionsHead ||
            null !== this._movesHead ||
            null !== this._removalsHead ||
            null !== this._identityChangesHead
          );
        }
        _reset() {
          if (this.isDirty) {
            let t;
            for (
              t = this._previousItHead = this._itHead;
              null !== t;
              t = t._next
            )
              t._nextPrevious = t._next;
            for (t = this._additionsHead; null !== t; t = t._nextAdded)
              t.previousIndex = t.currentIndex;
            for (
              this._additionsHead = this._additionsTail = null,
                t = this._movesHead;
              null !== t;
              t = t._nextMoved
            )
              t.previousIndex = t.currentIndex;
            (this._movesHead = this._movesTail = null),
              (this._removalsHead = this._removalsTail = null),
              (this._identityChangesHead = this._identityChangesTail = null);
          }
        }
        _mismatch(t, n, r, o) {
          let i;
          return (
            null === t ? (i = this._itTail) : ((i = t._prev), this._remove(t)),
            null !==
            (t =
              null === this._unlinkedRecords
                ? null
                : this._unlinkedRecords.get(r, null))
              ? (Object.is(t.item, n) || this._addIdentityChange(t, n),
                this._reinsertAfter(t, i, o))
              : null !==
                (t =
                  null === this._linkedRecords
                    ? null
                    : this._linkedRecords.get(r, o))
              ? (Object.is(t.item, n) || this._addIdentityChange(t, n),
                this._moveAfter(t, i, o))
              : (t = this._addAfter(new LM(n, r), i, o)),
            t
          );
        }
        _verifyReinsertion(t, n, r, o) {
          let i =
            null === this._unlinkedRecords
              ? null
              : this._unlinkedRecords.get(r, null);
          return (
            null !== i
              ? (t = this._reinsertAfter(i, t._prev, o))
              : t.currentIndex != o &&
                ((t.currentIndex = o), this._addToMoves(t, o)),
            t
          );
        }
        _truncate(t) {
          for (; null !== t; ) {
            const n = t._next;
            this._addToRemovals(this._unlink(t)), (t = n);
          }
          null !== this._unlinkedRecords && this._unlinkedRecords.clear(),
            null !== this._additionsTail &&
              (this._additionsTail._nextAdded = null),
            null !== this._movesTail && (this._movesTail._nextMoved = null),
            null !== this._itTail && (this._itTail._next = null),
            null !== this._removalsTail &&
              (this._removalsTail._nextRemoved = null),
            null !== this._identityChangesTail &&
              (this._identityChangesTail._nextIdentityChange = null);
        }
        _reinsertAfter(t, n, r) {
          null !== this._unlinkedRecords && this._unlinkedRecords.remove(t);
          const o = t._prevRemoved,
            i = t._nextRemoved;
          return (
            null === o ? (this._removalsHead = i) : (o._nextRemoved = i),
            null === i ? (this._removalsTail = o) : (i._prevRemoved = o),
            this._insertAfter(t, n, r),
            this._addToMoves(t, r),
            t
          );
        }
        _moveAfter(t, n, r) {
          return (
            this._unlink(t),
            this._insertAfter(t, n, r),
            this._addToMoves(t, r),
            t
          );
        }
        _addAfter(t, n, r) {
          return (
            this._insertAfter(t, n, r),
            (this._additionsTail =
              null === this._additionsTail
                ? (this._additionsHead = t)
                : (this._additionsTail._nextAdded = t)),
            t
          );
        }
        _insertAfter(t, n, r) {
          const o = null === n ? this._itHead : n._next;
          return (
            (t._next = o),
            (t._prev = n),
            null === o ? (this._itTail = t) : (o._prev = t),
            null === n ? (this._itHead = t) : (n._next = t),
            null === this._linkedRecords && (this._linkedRecords = new dy()),
            this._linkedRecords.put(t),
            (t.currentIndex = r),
            t
          );
        }
        _remove(t) {
          return this._addToRemovals(this._unlink(t));
        }
        _unlink(t) {
          null !== this._linkedRecords && this._linkedRecords.remove(t);
          const n = t._prev,
            r = t._next;
          return (
            null === n ? (this._itHead = r) : (n._next = r),
            null === r ? (this._itTail = n) : (r._prev = n),
            t
          );
        }
        _addToMoves(t, n) {
          return (
            t.previousIndex === n ||
              (this._movesTail =
                null === this._movesTail
                  ? (this._movesHead = t)
                  : (this._movesTail._nextMoved = t)),
            t
          );
        }
        _addToRemovals(t) {
          return (
            null === this._unlinkedRecords &&
              (this._unlinkedRecords = new dy()),
            this._unlinkedRecords.put(t),
            (t.currentIndex = null),
            (t._nextRemoved = null),
            null === this._removalsTail
              ? ((this._removalsTail = this._removalsHead = t),
                (t._prevRemoved = null))
              : ((t._prevRemoved = this._removalsTail),
                (this._removalsTail = this._removalsTail._nextRemoved = t)),
            t
          );
        }
        _addIdentityChange(t, n) {
          return (
            (t.item = n),
            (this._identityChangesTail =
              null === this._identityChangesTail
                ? (this._identityChangesHead = t)
                : (this._identityChangesTail._nextIdentityChange = t)),
            t
          );
        }
      }
      class LM {
        constructor(t, n) {
          (this.item = t),
            (this.trackById = n),
            (this.currentIndex = null),
            (this.previousIndex = null),
            (this._nextPrevious = null),
            (this._prev = null),
            (this._next = null),
            (this._prevDup = null),
            (this._nextDup = null),
            (this._prevRemoved = null),
            (this._nextRemoved = null),
            (this._nextAdded = null),
            (this._nextMoved = null),
            (this._nextIdentityChange = null);
        }
      }
      class jM {
        constructor() {
          (this._head = null), (this._tail = null);
        }
        add(t) {
          null === this._head
            ? ((this._head = this._tail = t),
              (t._nextDup = null),
              (t._prevDup = null))
            : ((this._tail._nextDup = t),
              (t._prevDup = this._tail),
              (t._nextDup = null),
              (this._tail = t));
        }
        get(t, n) {
          let r;
          for (r = this._head; null !== r; r = r._nextDup)
            if (
              (null === n || n <= r.currentIndex) &&
              Object.is(r.trackById, t)
            )
              return r;
          return null;
        }
        remove(t) {
          const n = t._prevDup,
            r = t._nextDup;
          return (
            null === n ? (this._head = r) : (n._nextDup = r),
            null === r ? (this._tail = n) : (r._prevDup = n),
            null === this._head
          );
        }
      }
      class dy {
        constructor() {
          this.map = new Map();
        }
        put(t) {
          const n = t.trackById;
          let r = this.map.get(n);
          r || ((r = new jM()), this.map.set(n, r)), r.add(t);
        }
        get(t, n) {
          const o = this.map.get(t);
          return o ? o.get(t, n) : null;
        }
        remove(t) {
          const n = t.trackById;
          return this.map.get(n).remove(t) && this.map.delete(n), t;
        }
        get isEmpty() {
          return 0 === this.map.size;
        }
        clear() {
          this.map.clear();
        }
      }
      function fy(e, t, n) {
        const r = e.previousIndex;
        if (null === r) return r;
        let o = 0;
        return n && r < n.length && (o = n[r]), r + t + o;
      }
      function py() {
        return new Cs([new ly()]);
      }
      let Cs = (() => {
        class e {
          constructor(n) {
            this.factories = n;
          }
          static create(n, r) {
            if (null != r) {
              const o = r.factories.slice();
              n = n.concat(o);
            }
            return new e(n);
          }
          static extend(n) {
            return {
              provide: e,
              useFactory: (r) => e.create(n, r || py()),
              deps: [[e, new co(), new uo()]],
            };
          }
          find(n) {
            const r = this.factories.find((o) => o.supports(n));
            if (null != r) return r;
            throw new w(901, !1);
          }
        }
        return (e.ɵprov = P({ token: e, providedIn: "root", factory: py })), e;
      })();
      const HM = Jm(null, "core", []);
      let zM = (() => {
          class e {
            constructor(n) {}
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)(x(ys));
            }),
            (e.ɵmod = bn({ type: e })),
            (e.ɵinj = un({})),
            e
          );
        })(),
        Zc = null;
      function $n() {
        return Zc;
      }
      class qM {}
      const Ye = new N("DocumentToken");
      let Qc = (() => {
        class e {
          historyGo(n) {
            throw new Error("Not implemented");
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)();
          }),
          (e.ɵprov = P({
            token: e,
            factory: function () {
              return (function ZM() {
                return x(my);
              })();
            },
            providedIn: "platform",
          })),
          e
        );
      })();
      const QM = new N("Location Initialized");
      let my = (() => {
        class e extends Qc {
          constructor(n) {
            super(),
              (this._doc = n),
              (this._location = window.location),
              (this._history = window.history);
          }
          getBaseHrefFromDOM() {
            return $n().getBaseHref(this._doc);
          }
          onPopState(n) {
            const r = $n().getGlobalEventTarget(this._doc, "window");
            return (
              r.addEventListener("popstate", n, !1),
              () => r.removeEventListener("popstate", n)
            );
          }
          onHashChange(n) {
            const r = $n().getGlobalEventTarget(this._doc, "window");
            return (
              r.addEventListener("hashchange", n, !1),
              () => r.removeEventListener("hashchange", n)
            );
          }
          get href() {
            return this._location.href;
          }
          get protocol() {
            return this._location.protocol;
          }
          get hostname() {
            return this._location.hostname;
          }
          get port() {
            return this._location.port;
          }
          get pathname() {
            return this._location.pathname;
          }
          get search() {
            return this._location.search;
          }
          get hash() {
            return this._location.hash;
          }
          set pathname(n) {
            this._location.pathname = n;
          }
          pushState(n, r, o) {
            yy() ? this._history.pushState(n, r, o) : (this._location.hash = o);
          }
          replaceState(n, r, o) {
            yy()
              ? this._history.replaceState(n, r, o)
              : (this._location.hash = o);
          }
          forward() {
            this._history.forward();
          }
          back() {
            this._history.back();
          }
          historyGo(n = 0) {
            this._history.go(n);
          }
          getState() {
            return this._history.state;
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(x(Ye));
          }),
          (e.ɵprov = P({
            token: e,
            factory: function () {
              return (function YM() {
                return new my(x(Ye));
              })();
            },
            providedIn: "platform",
          })),
          e
        );
      })();
      function yy() {
        return !!window.history.pushState;
      }
      function Yc(e, t) {
        if (0 == e.length) return t;
        if (0 == t.length) return e;
        let n = 0;
        return (
          e.endsWith("/") && n++,
          t.startsWith("/") && n++,
          2 == n ? e + t.substring(1) : 1 == n ? e + t : e + "/" + t
        );
      }
      function vy(e) {
        const t = e.match(/#|\?|$/),
          n = (t && t.index) || e.length;
        return e.slice(0, n - ("/" === e[n - 1] ? 1 : 0)) + e.slice(n);
      }
      function nn(e) {
        return e && "?" !== e[0] ? "?" + e : e;
      }
      let Vn = (() => {
        class e {
          historyGo(n) {
            throw new Error("Not implemented");
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)();
          }),
          (e.ɵprov = P({
            token: e,
            factory: function () {
              return H(wy);
            },
            providedIn: "root",
          })),
          e
        );
      })();
      const Dy = new N("appBaseHref");
      let wy = (() => {
          class e extends Vn {
            constructor(n, r) {
              super(),
                (this._platformLocation = n),
                (this._removeListenerFns = []),
                (this._baseHref =
                  r ??
                  this._platformLocation.getBaseHrefFromDOM() ??
                  H(Ye).location?.origin ??
                  "");
            }
            ngOnDestroy() {
              for (; this._removeListenerFns.length; )
                this._removeListenerFns.pop()();
            }
            onPopState(n) {
              this._removeListenerFns.push(
                this._platformLocation.onPopState(n),
                this._platformLocation.onHashChange(n)
              );
            }
            getBaseHref() {
              return this._baseHref;
            }
            prepareExternalUrl(n) {
              return Yc(this._baseHref, n);
            }
            path(n = !1) {
              const r =
                  this._platformLocation.pathname +
                  nn(this._platformLocation.search),
                o = this._platformLocation.hash;
              return o && n ? `${r}${o}` : r;
            }
            pushState(n, r, o, i) {
              const s = this.prepareExternalUrl(o + nn(i));
              this._platformLocation.pushState(n, r, s);
            }
            replaceState(n, r, o, i) {
              const s = this.prepareExternalUrl(o + nn(i));
              this._platformLocation.replaceState(n, r, s);
            }
            forward() {
              this._platformLocation.forward();
            }
            back() {
              this._platformLocation.back();
            }
            getState() {
              return this._platformLocation.getState();
            }
            historyGo(n = 0) {
              this._platformLocation.historyGo?.(n);
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)(x(Qc), x(Dy, 8));
            }),
            (e.ɵprov = P({ token: e, factory: e.ɵfac, providedIn: "root" })),
            e
          );
        })(),
        KM = (() => {
          class e extends Vn {
            constructor(n, r) {
              super(),
                (this._platformLocation = n),
                (this._baseHref = ""),
                (this._removeListenerFns = []),
                null != r && (this._baseHref = r);
            }
            ngOnDestroy() {
              for (; this._removeListenerFns.length; )
                this._removeListenerFns.pop()();
            }
            onPopState(n) {
              this._removeListenerFns.push(
                this._platformLocation.onPopState(n),
                this._platformLocation.onHashChange(n)
              );
            }
            getBaseHref() {
              return this._baseHref;
            }
            path(n = !1) {
              let r = this._platformLocation.hash;
              return null == r && (r = "#"), r.length > 0 ? r.substring(1) : r;
            }
            prepareExternalUrl(n) {
              const r = Yc(this._baseHref, n);
              return r.length > 0 ? "#" + r : r;
            }
            pushState(n, r, o, i) {
              let s = this.prepareExternalUrl(o + nn(i));
              0 == s.length && (s = this._platformLocation.pathname),
                this._platformLocation.pushState(n, r, s);
            }
            replaceState(n, r, o, i) {
              let s = this.prepareExternalUrl(o + nn(i));
              0 == s.length && (s = this._platformLocation.pathname),
                this._platformLocation.replaceState(n, r, s);
            }
            forward() {
              this._platformLocation.forward();
            }
            back() {
              this._platformLocation.back();
            }
            getState() {
              return this._platformLocation.getState();
            }
            historyGo(n = 0) {
              this._platformLocation.historyGo?.(n);
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)(x(Qc), x(Dy, 8));
            }),
            (e.ɵprov = P({ token: e, factory: e.ɵfac })),
            e
          );
        })(),
        Kc = (() => {
          class e {
            constructor(n) {
              (this._subject = new Be()),
                (this._urlChangeListeners = []),
                (this._urlChangeSubscription = null),
                (this._locationStrategy = n);
              const r = this._locationStrategy.getBaseHref();
              (this._basePath = (function eT(e) {
                if (new RegExp("^(https?:)?//").test(e)) {
                  const [, n] = e.split(/\/\/[^\/]+/);
                  return n;
                }
                return e;
              })(vy(Cy(r)))),
                this._locationStrategy.onPopState((o) => {
                  this._subject.emit({
                    url: this.path(!0),
                    pop: !0,
                    state: o.state,
                    type: o.type,
                  });
                });
            }
            ngOnDestroy() {
              this._urlChangeSubscription?.unsubscribe(),
                (this._urlChangeListeners = []);
            }
            path(n = !1) {
              return this.normalize(this._locationStrategy.path(n));
            }
            getState() {
              return this._locationStrategy.getState();
            }
            isCurrentPathEqualTo(n, r = "") {
              return this.path() == this.normalize(n + nn(r));
            }
            normalize(n) {
              return e.stripTrailingSlash(
                (function JM(e, t) {
                  if (!e || !t.startsWith(e)) return t;
                  const n = t.substring(e.length);
                  return "" === n || ["/", ";", "?", "#"].includes(n[0])
                    ? n
                    : t;
                })(this._basePath, Cy(n))
              );
            }
            prepareExternalUrl(n) {
              return (
                n && "/" !== n[0] && (n = "/" + n),
                this._locationStrategy.prepareExternalUrl(n)
              );
            }
            go(n, r = "", o = null) {
              this._locationStrategy.pushState(o, "", n, r),
                this._notifyUrlChangeListeners(
                  this.prepareExternalUrl(n + nn(r)),
                  o
                );
            }
            replaceState(n, r = "", o = null) {
              this._locationStrategy.replaceState(o, "", n, r),
                this._notifyUrlChangeListeners(
                  this.prepareExternalUrl(n + nn(r)),
                  o
                );
            }
            forward() {
              this._locationStrategy.forward();
            }
            back() {
              this._locationStrategy.back();
            }
            historyGo(n = 0) {
              this._locationStrategy.historyGo?.(n);
            }
            onUrlChange(n) {
              return (
                this._urlChangeListeners.push(n),
                this._urlChangeSubscription ||
                  (this._urlChangeSubscription = this.subscribe((r) => {
                    this._notifyUrlChangeListeners(r.url, r.state);
                  })),
                () => {
                  const r = this._urlChangeListeners.indexOf(n);
                  this._urlChangeListeners.splice(r, 1),
                    0 === this._urlChangeListeners.length &&
                      (this._urlChangeSubscription?.unsubscribe(),
                      (this._urlChangeSubscription = null));
                }
              );
            }
            _notifyUrlChangeListeners(n = "", r) {
              this._urlChangeListeners.forEach((o) => o(n, r));
            }
            subscribe(n, r, o) {
              return this._subject.subscribe({
                next: n,
                error: r,
                complete: o,
              });
            }
          }
          return (
            (e.normalizeQueryParams = nn),
            (e.joinWithSlash = Yc),
            (e.stripTrailingSlash = vy),
            (e.ɵfac = function (n) {
              return new (n || e)(x(Vn));
            }),
            (e.ɵprov = P({
              token: e,
              factory: function () {
                return (function XM() {
                  return new Kc(x(Vn));
                })();
              },
              providedIn: "root",
            })),
            e
          );
        })();
      function Cy(e) {
        return e.replace(/\/index.html$/, "");
      }
      class VT {
        constructor(t, n, r, o) {
          (this.$implicit = t),
            (this.ngForOf = n),
            (this.index = r),
            (this.count = o);
        }
        get first() {
          return 0 === this.index;
        }
        get last() {
          return this.index === this.count - 1;
        }
        get even() {
          return this.index % 2 == 0;
        }
        get odd() {
          return !this.even;
        }
      }
      let ul = (() => {
        class e {
          set ngForOf(n) {
            (this._ngForOf = n), (this._ngForOfDirty = !0);
          }
          set ngForTrackBy(n) {
            this._trackByFn = n;
          }
          get ngForTrackBy() {
            return this._trackByFn;
          }
          constructor(n, r, o) {
            (this._viewContainer = n),
              (this._template = r),
              (this._differs = o),
              (this._ngForOf = null),
              (this._ngForOfDirty = !0),
              (this._differ = null);
          }
          set ngForTemplate(n) {
            n && (this._template = n);
          }
          ngDoCheck() {
            if (this._ngForOfDirty) {
              this._ngForOfDirty = !1;
              const n = this._ngForOf;
              !this._differ &&
                n &&
                (this._differ = this._differs
                  .find(n)
                  .create(this.ngForTrackBy));
            }
            if (this._differ) {
              const n = this._differ.diff(this._ngForOf);
              n && this._applyChanges(n);
            }
          }
          _applyChanges(n) {
            const r = this._viewContainer;
            n.forEachOperation((o, i, s) => {
              if (null == o.previousIndex)
                r.createEmbeddedView(
                  this._template,
                  new VT(o.item, this._ngForOf, -1, -1),
                  null === s ? void 0 : s
                );
              else if (null == s) r.remove(null === i ? void 0 : i);
              else if (null !== i) {
                const a = r.get(i);
                r.move(a, s), Ny(a, o);
              }
            });
            for (let o = 0, i = r.length; o < i; o++) {
              const a = r.get(o).context;
              (a.index = o), (a.count = i), (a.ngForOf = this._ngForOf);
            }
            n.forEachIdentityChange((o) => {
              Ny(r.get(o.currentIndex), o);
            });
          }
          static ngTemplateContextGuard(n, r) {
            return !0;
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(I(wt), I(Jt), I(Cs));
          }),
          (e.ɵdir = ke({
            type: e,
            selectors: [["", "ngFor", "", "ngForOf", ""]],
            inputs: {
              ngForOf: "ngForOf",
              ngForTrackBy: "ngForTrackBy",
              ngForTemplate: "ngForTemplate",
            },
            standalone: !0,
          })),
          e
        );
      })();
      function Ny(e, t) {
        e.context.$implicit = t.item;
      }
      let pA = (() => {
        class e {}
        return (
          (e.ɵfac = function (n) {
            return new (n || e)();
          }),
          (e.ɵmod = bn({ type: e })),
          (e.ɵinj = un({})),
          e
        );
      })();
      let vA = (() => {
        class e {}
        return (
          (e.ɵprov = P({
            token: e,
            providedIn: "root",
            factory: () => new DA(x(Ye), window),
          })),
          e
        );
      })();
      class DA {
        constructor(t, n) {
          (this.document = t), (this.window = n), (this.offset = () => [0, 0]);
        }
        setOffset(t) {
          this.offset = Array.isArray(t) ? () => t : t;
        }
        getScrollPosition() {
          return this.supportsScrolling()
            ? [this.window.pageXOffset, this.window.pageYOffset]
            : [0, 0];
        }
        scrollToPosition(t) {
          this.supportsScrolling() && this.window.scrollTo(t[0], t[1]);
        }
        scrollToAnchor(t) {
          if (!this.supportsScrolling()) return;
          const n = (function wA(e, t) {
            const n = e.getElementById(t) || e.getElementsByName(t)[0];
            if (n) return n;
            if (
              "function" == typeof e.createTreeWalker &&
              e.body &&
              (e.body.createShadowRoot || e.body.attachShadow)
            ) {
              const r = e.createTreeWalker(e.body, NodeFilter.SHOW_ELEMENT);
              let o = r.currentNode;
              for (; o; ) {
                const i = o.shadowRoot;
                if (i) {
                  const s =
                    i.getElementById(t) || i.querySelector(`[name="${t}"]`);
                  if (s) return s;
                }
                o = r.nextNode();
              }
            }
            return null;
          })(this.document, t);
          n && (this.scrollToElement(n), n.focus());
        }
        setHistoryScrollRestoration(t) {
          if (this.supportScrollRestoration()) {
            const n = this.window.history;
            n && n.scrollRestoration && (n.scrollRestoration = t);
          }
        }
        scrollToElement(t) {
          const n = t.getBoundingClientRect(),
            r = n.left + this.window.pageXOffset,
            o = n.top + this.window.pageYOffset,
            i = this.offset();
          this.window.scrollTo(r - i[0], o - i[1]);
        }
        supportScrollRestoration() {
          try {
            if (!this.supportsScrolling()) return !1;
            const t =
              jy(this.window.history) ||
              jy(Object.getPrototypeOf(this.window.history));
            return !(!t || (!t.writable && !t.set));
          } catch {
            return !1;
          }
        }
        supportsScrolling() {
          try {
            return (
              !!this.window &&
              !!this.window.scrollTo &&
              "pageXOffset" in this.window
            );
          } catch {
            return !1;
          }
        }
      }
      function jy(e) {
        return Object.getOwnPropertyDescriptor(e, "scrollRestoration");
      }
      class ZA extends qM {
        constructor() {
          super(...arguments), (this.supportsDOMEvents = !0);
        }
      }
      class gl extends ZA {
        static makeCurrent() {
          !(function WM(e) {
            Zc || (Zc = e);
          })(new gl());
        }
        onAndCancel(t, n, r) {
          return (
            t.addEventListener(n, r, !1),
            () => {
              t.removeEventListener(n, r, !1);
            }
          );
        }
        dispatchEvent(t, n) {
          t.dispatchEvent(n);
        }
        remove(t) {
          t.parentNode && t.parentNode.removeChild(t);
        }
        createElement(t, n) {
          return (n = n || this.getDefaultDocument()).createElement(t);
        }
        createHtmlDocument() {
          return document.implementation.createHTMLDocument("fakeTitle");
        }
        getDefaultDocument() {
          return document;
        }
        isElementNode(t) {
          return t.nodeType === Node.ELEMENT_NODE;
        }
        isShadowRoot(t) {
          return t instanceof DocumentFragment;
        }
        getGlobalEventTarget(t, n) {
          return "window" === n
            ? window
            : "document" === n
            ? t
            : "body" === n
            ? t.body
            : null;
        }
        getBaseHref(t) {
          const n = (function QA() {
            return (
              (jo = jo || document.querySelector("base")),
              jo ? jo.getAttribute("href") : null
            );
          })();
          return null == n
            ? null
            : (function YA(e) {
                (Ns = Ns || document.createElement("a")),
                  Ns.setAttribute("href", e);
                const t = Ns.pathname;
                return "/" === t.charAt(0) ? t : `/${t}`;
              })(n);
        }
        resetBaseElement() {
          jo = null;
        }
        getUserAgent() {
          return window.navigator.userAgent;
        }
        getCookie(t) {
          return (function LT(e, t) {
            t = encodeURIComponent(t);
            for (const n of e.split(";")) {
              const r = n.indexOf("="),
                [o, i] = -1 == r ? [n, ""] : [n.slice(0, r), n.slice(r + 1)];
              if (o.trim() === t) return decodeURIComponent(i);
            }
            return null;
          })(document.cookie, t);
        }
      }
      let Ns,
        jo = null;
      const Hy = new N("TRANSITION_ID"),
        XA = [
          {
            provide: ps,
            useFactory: function KA(e, t, n) {
              return () => {
                n.get(gs).donePromise.then(() => {
                  const r = $n(),
                    o = t.querySelectorAll(`style[ng-transition="${e}"]`);
                  for (let i = 0; i < o.length; i++) r.remove(o[i]);
                });
              };
            },
            deps: [Hy, Ye, Kt],
            multi: !0,
          },
        ];
      let eR = (() => {
        class e {
          build() {
            return new XMLHttpRequest();
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)();
          }),
          (e.ɵprov = P({ token: e, factory: e.ɵfac })),
          e
        );
      })();
      const Os = new N("EventManagerPlugins");
      let Fs = (() => {
        class e {
          constructor(n, r) {
            (this._zone = r),
              (this._eventNameToPlugin = new Map()),
              n.forEach((o) => {
                o.manager = this;
              }),
              (this._plugins = n.slice().reverse());
          }
          addEventListener(n, r, o) {
            return this._findPluginFor(r).addEventListener(n, r, o);
          }
          addGlobalEventListener(n, r, o) {
            return this._findPluginFor(r).addGlobalEventListener(n, r, o);
          }
          getZone() {
            return this._zone;
          }
          _findPluginFor(n) {
            const r = this._eventNameToPlugin.get(n);
            if (r) return r;
            const o = this._plugins;
            for (let i = 0; i < o.length; i++) {
              const s = o[i];
              if (s.supports(n)) return this._eventNameToPlugin.set(n, s), s;
            }
            throw new Error(`No event manager plugin found for event ${n}`);
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(x(Os), x(de));
          }),
          (e.ɵprov = P({ token: e, factory: e.ɵfac })),
          e
        );
      })();
      class zy {
        constructor(t) {
          this._doc = t;
        }
        addGlobalEventListener(t, n, r) {
          const o = $n().getGlobalEventTarget(this._doc, t);
          if (!o)
            throw new Error(`Unsupported event target ${o} for event ${n}`);
          return this.addEventListener(o, n, r);
        }
      }
      let Gy = (() => {
          class e {
            constructor() {
              this.usageCount = new Map();
            }
            addStyles(n) {
              for (const r of n)
                1 === this.changeUsageCount(r, 1) && this.onStyleAdded(r);
            }
            removeStyles(n) {
              for (const r of n)
                0 === this.changeUsageCount(r, -1) && this.onStyleRemoved(r);
            }
            onStyleRemoved(n) {}
            onStyleAdded(n) {}
            getAllStyles() {
              return this.usageCount.keys();
            }
            changeUsageCount(n, r) {
              const o = this.usageCount;
              let i = o.get(n) ?? 0;
              return (i += r), i > 0 ? o.set(n, i) : o.delete(n), i;
            }
            ngOnDestroy() {
              for (const n of this.getAllStyles()) this.onStyleRemoved(n);
              this.usageCount.clear();
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)();
            }),
            (e.ɵprov = P({ token: e, factory: e.ɵfac })),
            e
          );
        })(),
        $o = (() => {
          class e extends Gy {
            constructor(n) {
              super(),
                (this.doc = n),
                (this.styleRef = new Map()),
                (this.hostNodes = new Set()),
                this.resetHostNodes();
            }
            onStyleAdded(n) {
              for (const r of this.hostNodes) this.addStyleToHost(r, n);
            }
            onStyleRemoved(n) {
              const r = this.styleRef;
              r.get(n)?.forEach((i) => i.remove()), r.delete(n);
            }
            ngOnDestroy() {
              super.ngOnDestroy(), this.styleRef.clear(), this.resetHostNodes();
            }
            addHost(n) {
              this.hostNodes.add(n);
              for (const r of this.getAllStyles()) this.addStyleToHost(n, r);
            }
            removeHost(n) {
              this.hostNodes.delete(n);
            }
            addStyleToHost(n, r) {
              const o = this.doc.createElement("style");
              (o.textContent = r), n.appendChild(o);
              const i = this.styleRef.get(r);
              i ? i.push(o) : this.styleRef.set(r, [o]);
            }
            resetHostNodes() {
              const n = this.hostNodes;
              n.clear(), n.add(this.doc.head);
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)(x(Ye));
            }),
            (e.ɵprov = P({ token: e, factory: e.ɵfac })),
            e
          );
        })();
      const ml = {
          svg: "http://www.w3.org/2000/svg",
          xhtml: "http://www.w3.org/1999/xhtml",
          xlink: "http://www.w3.org/1999/xlink",
          xml: "http://www.w3.org/XML/1998/namespace",
          xmlns: "http://www.w3.org/2000/xmlns/",
          math: "http://www.w3.org/1998/MathML/",
        },
        yl = /%COMP%/g,
        Zy = new N("RemoveStylesOnCompDestory", {
          providedIn: "root",
          factory: () => !1,
        });
      function Qy(e, t) {
        return t.flat(100).map((n) => n.replace(yl, e));
      }
      function Yy(e) {
        return (t) => {
          if ("__ngUnwrap__" === t) return e;
          !1 === e(t) && (t.preventDefault(), (t.returnValue = !1));
        };
      }
      let vl = (() => {
        class e {
          constructor(n, r, o, i) {
            (this.eventManager = n),
              (this.sharedStylesHost = r),
              (this.appId = o),
              (this.removeStylesOnCompDestory = i),
              (this.rendererByCompId = new Map()),
              (this.defaultRenderer = new Dl(n));
          }
          createRenderer(n, r) {
            if (!n || !r) return this.defaultRenderer;
            const o = this.getOrCreateRenderer(n, r);
            return (
              o instanceof Jy
                ? o.applyToHost(n)
                : o instanceof wl && o.applyStyles(),
              o
            );
          }
          getOrCreateRenderer(n, r) {
            const o = this.rendererByCompId;
            let i = o.get(r.id);
            if (!i) {
              const s = this.eventManager,
                a = this.sharedStylesHost,
                u = this.removeStylesOnCompDestory;
              switch (r.encapsulation) {
                case Tt.Emulated:
                  i = new Jy(s, a, r, this.appId, u);
                  break;
                case Tt.ShadowDom:
                  return new aR(s, a, n, r);
                default:
                  i = new wl(s, a, r, u);
              }
              (i.onDestroy = () => o.delete(r.id)), o.set(r.id, i);
            }
            return i;
          }
          ngOnDestroy() {
            this.rendererByCompId.clear();
          }
          begin() {}
          end() {}
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(x(Fs), x($o), x(No), x(Zy));
          }),
          (e.ɵprov = P({ token: e, factory: e.ɵfac })),
          e
        );
      })();
      class Dl {
        constructor(t) {
          (this.eventManager = t),
            (this.data = Object.create(null)),
            (this.destroyNode = null);
        }
        destroy() {}
        createElement(t, n) {
          return n
            ? document.createElementNS(ml[n] || n, t)
            : document.createElement(t);
        }
        createComment(t) {
          return document.createComment(t);
        }
        createText(t) {
          return document.createTextNode(t);
        }
        appendChild(t, n) {
          (Xy(t) ? t.content : t).appendChild(n);
        }
        insertBefore(t, n, r) {
          t && (Xy(t) ? t.content : t).insertBefore(n, r);
        }
        removeChild(t, n) {
          t && t.removeChild(n);
        }
        selectRootElement(t, n) {
          let r = "string" == typeof t ? document.querySelector(t) : t;
          if (!r)
            throw new Error(`The selector "${t}" did not match any elements`);
          return n || (r.textContent = ""), r;
        }
        parentNode(t) {
          return t.parentNode;
        }
        nextSibling(t) {
          return t.nextSibling;
        }
        setAttribute(t, n, r, o) {
          if (o) {
            n = o + ":" + n;
            const i = ml[o];
            i ? t.setAttributeNS(i, n, r) : t.setAttribute(n, r);
          } else t.setAttribute(n, r);
        }
        removeAttribute(t, n, r) {
          if (r) {
            const o = ml[r];
            o ? t.removeAttributeNS(o, n) : t.removeAttribute(`${r}:${n}`);
          } else t.removeAttribute(n);
        }
        addClass(t, n) {
          t.classList.add(n);
        }
        removeClass(t, n) {
          t.classList.remove(n);
        }
        setStyle(t, n, r, o) {
          o & (qe.DashCase | qe.Important)
            ? t.style.setProperty(n, r, o & qe.Important ? "important" : "")
            : (t.style[n] = r);
        }
        removeStyle(t, n, r) {
          r & qe.DashCase ? t.style.removeProperty(n) : (t.style[n] = "");
        }
        setProperty(t, n, r) {
          t[n] = r;
        }
        setValue(t, n) {
          t.nodeValue = n;
        }
        listen(t, n, r) {
          return "string" == typeof t
            ? this.eventManager.addGlobalEventListener(t, n, Yy(r))
            : this.eventManager.addEventListener(t, n, Yy(r));
        }
      }
      function Xy(e) {
        return "TEMPLATE" === e.tagName && void 0 !== e.content;
      }
      class aR extends Dl {
        constructor(t, n, r, o) {
          super(t),
            (this.sharedStylesHost = n),
            (this.hostEl = r),
            (this.shadowRoot = r.attachShadow({ mode: "open" })),
            this.sharedStylesHost.addHost(this.shadowRoot);
          const i = Qy(o.id, o.styles);
          for (const s of i) {
            const a = document.createElement("style");
            (a.textContent = s), this.shadowRoot.appendChild(a);
          }
        }
        nodeOrShadowRoot(t) {
          return t === this.hostEl ? this.shadowRoot : t;
        }
        appendChild(t, n) {
          return super.appendChild(this.nodeOrShadowRoot(t), n);
        }
        insertBefore(t, n, r) {
          return super.insertBefore(this.nodeOrShadowRoot(t), n, r);
        }
        removeChild(t, n) {
          return super.removeChild(this.nodeOrShadowRoot(t), n);
        }
        parentNode(t) {
          return this.nodeOrShadowRoot(
            super.parentNode(this.nodeOrShadowRoot(t))
          );
        }
        destroy() {
          this.sharedStylesHost.removeHost(this.shadowRoot);
        }
      }
      class wl extends Dl {
        constructor(t, n, r, o, i = r.id) {
          super(t),
            (this.sharedStylesHost = n),
            (this.removeStylesOnCompDestory = o),
            (this.rendererUsageCount = 0),
            (this.styles = Qy(i, r.styles));
        }
        applyStyles() {
          this.sharedStylesHost.addStyles(this.styles),
            this.rendererUsageCount++;
        }
        destroy() {
          this.removeStylesOnCompDestory &&
            (this.sharedStylesHost.removeStyles(this.styles),
            this.rendererUsageCount--,
            0 === this.rendererUsageCount && this.onDestroy?.());
        }
      }
      class Jy extends wl {
        constructor(t, n, r, o, i) {
          const s = o + "-" + r.id;
          super(t, n, r, i, s),
            (this.contentAttr = (function oR(e) {
              return "_ngcontent-%COMP%".replace(yl, e);
            })(s)),
            (this.hostAttr = (function iR(e) {
              return "_nghost-%COMP%".replace(yl, e);
            })(s));
        }
        applyToHost(t) {
          this.applyStyles(), this.setAttribute(t, this.hostAttr, "");
        }
        createElement(t, n) {
          const r = super.createElement(t, n);
          return super.setAttribute(r, this.contentAttr, ""), r;
        }
      }
      let uR = (() => {
        class e extends zy {
          constructor(n) {
            super(n);
          }
          supports(n) {
            return !0;
          }
          addEventListener(n, r, o) {
            return (
              n.addEventListener(r, o, !1),
              () => this.removeEventListener(n, r, o)
            );
          }
          removeEventListener(n, r, o) {
            return n.removeEventListener(r, o);
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(x(Ye));
          }),
          (e.ɵprov = P({ token: e, factory: e.ɵfac })),
          e
        );
      })();
      const ev = ["alt", "control", "meta", "shift"],
        cR = {
          "\b": "Backspace",
          "\t": "Tab",
          "\x7f": "Delete",
          "\x1b": "Escape",
          Del: "Delete",
          Esc: "Escape",
          Left: "ArrowLeft",
          Right: "ArrowRight",
          Up: "ArrowUp",
          Down: "ArrowDown",
          Menu: "ContextMenu",
          Scroll: "ScrollLock",
          Win: "OS",
        },
        lR = {
          alt: (e) => e.altKey,
          control: (e) => e.ctrlKey,
          meta: (e) => e.metaKey,
          shift: (e) => e.shiftKey,
        };
      let dR = (() => {
        class e extends zy {
          constructor(n) {
            super(n);
          }
          supports(n) {
            return null != e.parseEventName(n);
          }
          addEventListener(n, r, o) {
            const i = e.parseEventName(r),
              s = e.eventCallback(i.fullKey, o, this.manager.getZone());
            return this.manager
              .getZone()
              .runOutsideAngular(() => $n().onAndCancel(n, i.domEventName, s));
          }
          static parseEventName(n) {
            const r = n.toLowerCase().split("."),
              o = r.shift();
            if (0 === r.length || ("keydown" !== o && "keyup" !== o))
              return null;
            const i = e._normalizeKey(r.pop());
            let s = "",
              a = r.indexOf("code");
            if (
              (a > -1 && (r.splice(a, 1), (s = "code.")),
              ev.forEach((c) => {
                const l = r.indexOf(c);
                l > -1 && (r.splice(l, 1), (s += c + "."));
              }),
              (s += i),
              0 != r.length || 0 === i.length)
            )
              return null;
            const u = {};
            return (u.domEventName = o), (u.fullKey = s), u;
          }
          static matchEventFullKeyCode(n, r) {
            let o = cR[n.key] || n.key,
              i = "";
            return (
              r.indexOf("code.") > -1 && ((o = n.code), (i = "code.")),
              !(null == o || !o) &&
                ((o = o.toLowerCase()),
                " " === o ? (o = "space") : "." === o && (o = "dot"),
                ev.forEach((s) => {
                  s !== o && (0, lR[s])(n) && (i += s + ".");
                }),
                (i += o),
                i === r)
            );
          }
          static eventCallback(n, r, o) {
            return (i) => {
              e.matchEventFullKeyCode(i, n) && o.runGuarded(() => r(i));
            };
          }
          static _normalizeKey(n) {
            return "esc" === n ? "escape" : n;
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(x(Ye));
          }),
          (e.ɵprov = P({ token: e, factory: e.ɵfac })),
          e
        );
      })();
      const gR = Jm(HM, "browser", [
          { provide: Um, useValue: "browser" },
          {
            provide: Bm,
            useValue: function fR() {
              gl.makeCurrent();
            },
            multi: !0,
          },
          {
            provide: Ye,
            useFactory: function pR() {
              return (
                (function L_(e) {
                  vu = e;
                })(document),
                document
              );
            },
            deps: [],
          },
        ]),
        rv = new N(""),
        ov = [
          {
            provide: ms,
            useClass: class JA {
              addToWindow(t) {
                (ne.getAngularTestability = (r, o = !0) => {
                  const i = t.findTestabilityInTree(r, o);
                  if (null == i)
                    throw new Error("Could not find testability for element.");
                  return i;
                }),
                  (ne.getAllAngularTestabilities = () =>
                    t.getAllTestabilities()),
                  (ne.getAllAngularRootElements = () => t.getAllRootElements()),
                  ne.frameworkStabilizers || (ne.frameworkStabilizers = []),
                  ne.frameworkStabilizers.push((r) => {
                    const o = ne.getAllAngularTestabilities();
                    let i = o.length,
                      s = !1;
                    const a = function (u) {
                      (s = s || u), i--, 0 == i && r(s);
                    };
                    o.forEach(function (u) {
                      u.whenStable(a);
                    });
                  });
              }
              findTestabilityInTree(t, n, r) {
                return null == n
                  ? null
                  : t.getTestability(n) ??
                      (r
                        ? $n().isShadowRoot(n)
                          ? this.findTestabilityInTree(t, n.host, !0)
                          : this.findTestabilityInTree(t, n.parentElement, !0)
                        : null);
              }
            },
            deps: [],
          },
          { provide: Zm, useClass: Lc, deps: [de, jc, ms] },
          { provide: Lc, useClass: Lc, deps: [de, jc, ms] },
        ],
        iv = [
          { provide: Tu, useValue: "root" },
          {
            provide: hr,
            useFactory: function hR() {
              return new hr();
            },
            deps: [],
          },
          { provide: Os, useClass: uR, multi: !0, deps: [Ye, de, Um] },
          { provide: Os, useClass: dR, multi: !0, deps: [Ye] },
          { provide: vl, useClass: vl, deps: [Fs, $o, No, Zy] },
          { provide: Oh, useExisting: vl },
          { provide: Gy, useExisting: $o },
          { provide: $o, useClass: $o, deps: [Ye] },
          { provide: Fs, useClass: Fs, deps: [Os, de] },
          { provide: class CA {}, useClass: eR, deps: [] },
          [],
        ];
      let mR = (() => {
          class e {
            constructor(n) {}
            static withServerTransition(n) {
              return {
                ngModule: e,
                providers: [
                  { provide: No, useValue: n.appId },
                  { provide: Hy, useExisting: No },
                  XA,
                ],
              };
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)(x(rv, 12));
            }),
            (e.ɵmod = bn({ type: e })),
            (e.ɵinj = un({ providers: [...iv, ...ov], imports: [pA, zM] })),
            e
          );
        })(),
        sv = (() => {
          class e {
            constructor(n) {
              this._doc = n;
            }
            getTitle() {
              return this._doc.title;
            }
            setTitle(n) {
              this._doc.title = n || "";
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)(x(Ye));
            }),
            (e.ɵprov = P({
              token: e,
              factory: function (n) {
                let r = null;
                return (
                  (r = n
                    ? new n()
                    : (function vR() {
                        return new sv(x(Ye));
                      })()),
                  r
                );
              },
              providedIn: "root",
            })),
            e
          );
        })();
      function T(...e) {
        return De(e, Wr(e));
      }
      typeof window < "u" && window;
      class St extends Vt {
        constructor(t) {
          super(), (this._value = t);
        }
        get value() {
          return this.getValue();
        }
        _subscribe(t) {
          const n = super._subscribe(t);
          return !n.closed && t.next(this._value), n;
        }
        getValue() {
          const { hasError: t, thrownError: n, _value: r } = this;
          if (t) throw n;
          return this._throwIfClosed(), r;
        }
        next(t) {
          super.next((this._value = t));
        }
      }
      const ks = Hr(
          (e) =>
            function () {
              e(this),
                (this.name = "EmptyError"),
                (this.message = "no elements in sequence");
            }
        ),
        { isArray: SR } = Array,
        { getPrototypeOf: bR, prototype: IR, keys: MR } = Object;
      const { isArray: RR } = Array;
      function cv(...e) {
        const t = Wr(e),
          n = (function gw(e) {
            return J(ha(e)) ? e.pop() : void 0;
          })(e),
          { args: r, keys: o } = (function TR(e) {
            if (1 === e.length) {
              const t = e[0];
              if (SR(t)) return { args: t, keys: null };
              if (
                (function AR(e) {
                  return e && "object" == typeof e && bR(e) === IR;
                })(t)
              ) {
                const n = MR(t);
                return { args: n.map((r) => t[r]), keys: n };
              }
            }
            return { args: e, keys: null };
          })(e);
        if (0 === r.length) return De([], t);
        const i = new ve(
          (function OR(e, t, n = Sn) {
            return (r) => {
              lv(
                t,
                () => {
                  const { length: o } = e,
                    i = new Array(o);
                  let s = o,
                    a = o;
                  for (let u = 0; u < o; u++)
                    lv(
                      t,
                      () => {
                        const c = De(e[u], t);
                        let l = !1;
                        c.subscribe(
                          Se(
                            r,
                            (d) => {
                              (i[u] = d),
                                l || ((l = !0), a--),
                                a || r.next(n(i.slice()));
                            },
                            () => {
                              --s || r.complete();
                            }
                          )
                        );
                      },
                      r
                    );
                },
                r
              );
            };
          })(
            r,
            t,
            o
              ? (s) =>
                  (function NR(e, t) {
                    return e.reduce((n, r, o) => ((n[r] = t[o]), n), {});
                  })(o, s)
              : Sn
          )
        );
        return n
          ? i.pipe(
              (function PR(e) {
                return G((t) =>
                  (function xR(e, t) {
                    return RR(t) ? e(...t) : e(t);
                  })(e, t)
                );
              })(n)
            )
          : i;
      }
      function lv(e, t, n) {
        e ? Bt(n, e, t) : t();
      }
      function El(...e) {
        return (function FR() {
          return Wn(1);
        })()(De(e, Wr(e)));
      }
      function dv(e) {
        return new ve((t) => {
          bt(e()).subscribe(t);
        });
      }
      function Vo(e, t) {
        const n = J(e) ? e : () => e,
          r = (o) => o.error(n());
        return new ve(t ? (o) => t.schedule(r, 0, o) : r);
      }
      function Sl() {
        return Ee((e, t) => {
          let n = null;
          e._refCount++;
          const r = Se(t, void 0, void 0, void 0, () => {
            if (!e || e._refCount <= 0 || 0 < --e._refCount)
              return void (n = null);
            const o = e._connection,
              i = n;
            (n = null),
              o && (!i || o === i) && o.unsubscribe(),
              t.unsubscribe();
          });
          e.subscribe(r), r.closed || (n = e.connect());
        });
      }
      class fv extends ve {
        constructor(t, n) {
          super(),
            (this.source = t),
            (this.subjectFactory = n),
            (this._subject = null),
            (this._refCount = 0),
            (this._connection = null),
            cd(t) && (this.lift = t.lift);
        }
        _subscribe(t) {
          return this.getSubject().subscribe(t);
        }
        getSubject() {
          const t = this._subject;
          return (
            (!t || t.isStopped) && (this._subject = this.subjectFactory()),
            this._subject
          );
        }
        _teardown() {
          this._refCount = 0;
          const { _connection: t } = this;
          (this._subject = this._connection = null), t?.unsubscribe();
        }
        connect() {
          let t = this._connection;
          if (!t) {
            t = this._connection = new it();
            const n = this.getSubject();
            t.add(
              this.source.subscribe(
                Se(
                  n,
                  void 0,
                  () => {
                    this._teardown(), n.complete();
                  },
                  (r) => {
                    this._teardown(), n.error(r);
                  },
                  () => this._teardown()
                )
              )
            ),
              t.closed && ((this._connection = null), (t = it.EMPTY));
          }
          return t;
        }
        refCount() {
          return Sl()(this);
        }
      }
      function Lt(e, t) {
        return Ee((n, r) => {
          let o = null,
            i = 0,
            s = !1;
          const a = () => s && !o && r.complete();
          n.subscribe(
            Se(
              r,
              (u) => {
                o?.unsubscribe();
                let c = 0;
                const l = i++;
                bt(e(u, l)).subscribe(
                  (o = Se(
                    r,
                    (d) => r.next(t ? t(u, d, l, c++) : d),
                    () => {
                      (o = null), a();
                    }
                  ))
                );
              },
              () => {
                (s = !0), a();
              }
            )
          );
        });
      }
      function Nr(e) {
        return e <= 0
          ? () => It
          : Ee((t, n) => {
              let r = 0;
              t.subscribe(
                Se(n, (o) => {
                  ++r <= e && (n.next(o), e <= r && n.complete());
                })
              );
            });
      }
      function mn(e, t) {
        return Ee((n, r) => {
          let o = 0;
          n.subscribe(Se(r, (i) => e.call(t, i, o++) && r.next(i)));
        });
      }
      function Ls(e) {
        return Ee((t, n) => {
          let r = !1;
          t.subscribe(
            Se(
              n,
              (o) => {
                (r = !0), n.next(o);
              },
              () => {
                r || n.next(e), n.complete();
              }
            )
          );
        });
      }
      function hv(e = LR) {
        return Ee((t, n) => {
          let r = !1;
          t.subscribe(
            Se(
              n,
              (o) => {
                (r = !0), n.next(o);
              },
              () => (r ? n.complete() : n.error(e()))
            )
          );
        });
      }
      function LR() {
        return new ks();
      }
      function yn(e, t) {
        const n = arguments.length >= 2;
        return (r) =>
          r.pipe(
            e ? mn((o, i) => e(o, i, r)) : Sn,
            Nr(1),
            n ? Ls(t) : hv(() => new ks())
          );
      }
      function Bn(e, t) {
        return J(t) ? be(e, t, 1) : be(e, 1);
      }
      function Fe(e, t, n) {
        const r = J(e) || t || n ? { next: e, error: t, complete: n } : e;
        return r
          ? Ee((o, i) => {
              var s;
              null === (s = r.subscribe) || void 0 === s || s.call(r);
              let a = !0;
              o.subscribe(
                Se(
                  i,
                  (u) => {
                    var c;
                    null === (c = r.next) || void 0 === c || c.call(r, u),
                      i.next(u);
                  },
                  () => {
                    var u;
                    (a = !1),
                      null === (u = r.complete) || void 0 === u || u.call(r),
                      i.complete();
                  },
                  (u) => {
                    var c;
                    (a = !1),
                      null === (c = r.error) || void 0 === c || c.call(r, u),
                      i.error(u);
                  },
                  () => {
                    var u, c;
                    a &&
                      (null === (u = r.unsubscribe) ||
                        void 0 === u ||
                        u.call(r)),
                      null === (c = r.finalize) || void 0 === c || c.call(r);
                  }
                )
              );
            })
          : Sn;
      }
      function vn(e) {
        return Ee((t, n) => {
          let i,
            r = null,
            o = !1;
          (r = t.subscribe(
            Se(n, void 0, void 0, (s) => {
              (i = bt(e(s, vn(e)(t)))),
                r ? (r.unsubscribe(), (r = null), i.subscribe(n)) : (o = !0);
            })
          )),
            o && (r.unsubscribe(), (r = null), i.subscribe(n));
        });
      }
      function pv(e, t) {
        return Ee(
          (function jR(e, t, n, r, o) {
            return (i, s) => {
              let a = n,
                u = t,
                c = 0;
              i.subscribe(
                Se(
                  s,
                  (l) => {
                    const d = c++;
                    (u = a ? e(u, l, d) : ((a = !0), l)), r && s.next(u);
                  },
                  o &&
                    (() => {
                      a && s.next(u), s.complete();
                    })
                )
              );
            };
          })(e, t, arguments.length >= 2, !0)
        );
      }
      function bl(e) {
        return e <= 0
          ? () => It
          : Ee((t, n) => {
              let r = [];
              t.subscribe(
                Se(
                  n,
                  (o) => {
                    r.push(o), e < r.length && r.shift();
                  },
                  () => {
                    for (const o of r) n.next(o);
                    n.complete();
                  },
                  void 0,
                  () => {
                    r = null;
                  }
                )
              );
            });
      }
      function gv(e, t) {
        const n = arguments.length >= 2;
        return (r) =>
          r.pipe(
            e ? mn((o, i) => e(o, i, r)) : Sn,
            bl(1),
            n ? Ls(t) : hv(() => new ks())
          );
      }
      function Il(e) {
        return Ee((t, n) => {
          try {
            t.subscribe(n);
          } finally {
            n.add(e);
          }
        });
      }
      const j = "primary",
        Bo = Symbol("RouteTitle");
      class BR {
        constructor(t) {
          this.params = t || {};
        }
        has(t) {
          return Object.prototype.hasOwnProperty.call(this.params, t);
        }
        get(t) {
          if (this.has(t)) {
            const n = this.params[t];
            return Array.isArray(n) ? n[0] : n;
          }
          return null;
        }
        getAll(t) {
          if (this.has(t)) {
            const n = this.params[t];
            return Array.isArray(n) ? n : [n];
          }
          return [];
        }
        get keys() {
          return Object.keys(this.params);
        }
      }
      function Or(e) {
        return new BR(e);
      }
      function UR(e, t, n) {
        const r = n.path.split("/");
        if (
          r.length > e.length ||
          ("full" === n.pathMatch && (t.hasChildren() || r.length < e.length))
        )
          return null;
        const o = {};
        for (let i = 0; i < r.length; i++) {
          const s = r[i],
            a = e[i];
          if (s.startsWith(":")) o[s.substring(1)] = a;
          else if (s !== a.path) return null;
        }
        return { consumed: e.slice(0, r.length), posParams: o };
      }
      function jt(e, t) {
        const n = e ? Object.keys(e) : void 0,
          r = t ? Object.keys(t) : void 0;
        if (!n || !r || n.length != r.length) return !1;
        let o;
        for (let i = 0; i < n.length; i++)
          if (((o = n[i]), !mv(e[o], t[o]))) return !1;
        return !0;
      }
      function mv(e, t) {
        if (Array.isArray(e) && Array.isArray(t)) {
          if (e.length !== t.length) return !1;
          const n = [...e].sort(),
            r = [...t].sort();
          return n.every((o, i) => r[i] === o);
        }
        return e === t;
      }
      function yv(e) {
        return Array.prototype.concat.apply([], e);
      }
      function vv(e) {
        return e.length > 0 ? e[e.length - 1] : null;
      }
      function Ae(e, t) {
        for (const n in e) e.hasOwnProperty(n) && t(e[n], n);
      }
      function Dn(e) {
        return xp(e) ? e : ns(e) ? De(Promise.resolve(e)) : T(e);
      }
      const js = !1,
        zR = {
          exact: function Cv(e, t, n) {
            if (
              !Un(e.segments, t.segments) ||
              !$s(e.segments, t.segments, n) ||
              e.numberOfChildren !== t.numberOfChildren
            )
              return !1;
            for (const r in t.children)
              if (!e.children[r] || !Cv(e.children[r], t.children[r], n))
                return !1;
            return !0;
          },
          subset: _v,
        },
        Dv = {
          exact: function GR(e, t) {
            return jt(e, t);
          },
          subset: function WR(e, t) {
            return (
              Object.keys(t).length <= Object.keys(e).length &&
              Object.keys(t).every((n) => mv(e[n], t[n]))
            );
          },
          ignored: () => !0,
        };
      function wv(e, t, n) {
        return (
          zR[n.paths](e.root, t.root, n.matrixParams) &&
          Dv[n.queryParams](e.queryParams, t.queryParams) &&
          !("exact" === n.fragment && e.fragment !== t.fragment)
        );
      }
      function _v(e, t, n) {
        return Ev(e, t, t.segments, n);
      }
      function Ev(e, t, n, r) {
        if (e.segments.length > n.length) {
          const o = e.segments.slice(0, n.length);
          return !(!Un(o, n) || t.hasChildren() || !$s(o, n, r));
        }
        if (e.segments.length === n.length) {
          if (!Un(e.segments, n) || !$s(e.segments, n, r)) return !1;
          for (const o in t.children)
            if (!e.children[o] || !_v(e.children[o], t.children[o], r))
              return !1;
          return !0;
        }
        {
          const o = n.slice(0, e.segments.length),
            i = n.slice(e.segments.length);
          return (
            !!(Un(e.segments, o) && $s(e.segments, o, r) && e.children[j]) &&
            Ev(e.children[j], t, i, r)
          );
        }
      }
      function $s(e, t, n) {
        return t.every((r, o) => Dv[n](e[o].parameters, r.parameters));
      }
      class wn {
        constructor(t = new U([], {}), n = {}, r = null) {
          (this.root = t), (this.queryParams = n), (this.fragment = r);
        }
        get queryParamMap() {
          return (
            this._queryParamMap || (this._queryParamMap = Or(this.queryParams)),
            this._queryParamMap
          );
        }
        toString() {
          return QR.serialize(this);
        }
      }
      class U {
        constructor(t, n) {
          (this.segments = t),
            (this.children = n),
            (this.parent = null),
            Ae(n, (r, o) => (r.parent = this));
        }
        hasChildren() {
          return this.numberOfChildren > 0;
        }
        get numberOfChildren() {
          return Object.keys(this.children).length;
        }
        toString() {
          return Vs(this);
        }
      }
      class Uo {
        constructor(t, n) {
          (this.path = t), (this.parameters = n);
        }
        get parameterMap() {
          return (
            this._parameterMap || (this._parameterMap = Or(this.parameters)),
            this._parameterMap
          );
        }
        toString() {
          return Iv(this);
        }
      }
      function Un(e, t) {
        return e.length === t.length && e.every((n, r) => n.path === t[r].path);
      }
      let Ho = (() => {
        class e {}
        return (
          (e.ɵfac = function (n) {
            return new (n || e)();
          }),
          (e.ɵprov = P({
            token: e,
            factory: function () {
              return new Ml();
            },
            providedIn: "root",
          })),
          e
        );
      })();
      class Ml {
        parse(t) {
          const n = new ox(t);
          return new wn(
            n.parseRootSegment(),
            n.parseQueryParams(),
            n.parseFragment()
          );
        }
        serialize(t) {
          const n = `/${zo(t.root, !0)}`,
            r = (function XR(e) {
              const t = Object.keys(e)
                .map((n) => {
                  const r = e[n];
                  return Array.isArray(r)
                    ? r.map((o) => `${Bs(n)}=${Bs(o)}`).join("&")
                    : `${Bs(n)}=${Bs(r)}`;
                })
                .filter((n) => !!n);
              return t.length ? `?${t.join("&")}` : "";
            })(t.queryParams);
          return `${n}${r}${
            "string" == typeof t.fragment
              ? `#${(function YR(e) {
                  return encodeURI(e);
                })(t.fragment)}`
              : ""
          }`;
        }
      }
      const QR = new Ml();
      function Vs(e) {
        return e.segments.map((t) => Iv(t)).join("/");
      }
      function zo(e, t) {
        if (!e.hasChildren()) return Vs(e);
        if (t) {
          const n = e.children[j] ? zo(e.children[j], !1) : "",
            r = [];
          return (
            Ae(e.children, (o, i) => {
              i !== j && r.push(`${i}:${zo(o, !1)}`);
            }),
            r.length > 0 ? `${n}(${r.join("//")})` : n
          );
        }
        {
          const n = (function ZR(e, t) {
            let n = [];
            return (
              Ae(e.children, (r, o) => {
                o === j && (n = n.concat(t(r, o)));
              }),
              Ae(e.children, (r, o) => {
                o !== j && (n = n.concat(t(r, o)));
              }),
              n
            );
          })(e, (r, o) =>
            o === j ? [zo(e.children[j], !1)] : [`${o}:${zo(r, !1)}`]
          );
          return 1 === Object.keys(e.children).length && null != e.children[j]
            ? `${Vs(e)}/${n[0]}`
            : `${Vs(e)}/(${n.join("//")})`;
        }
      }
      function Sv(e) {
        return encodeURIComponent(e)
          .replace(/%40/g, "@")
          .replace(/%3A/gi, ":")
          .replace(/%24/g, "$")
          .replace(/%2C/gi, ",");
      }
      function Bs(e) {
        return Sv(e).replace(/%3B/gi, ";");
      }
      function Tl(e) {
        return Sv(e)
          .replace(/\(/g, "%28")
          .replace(/\)/g, "%29")
          .replace(/%26/gi, "&");
      }
      function Us(e) {
        return decodeURIComponent(e);
      }
      function bv(e) {
        return Us(e.replace(/\+/g, "%20"));
      }
      function Iv(e) {
        return `${Tl(e.path)}${(function KR(e) {
          return Object.keys(e)
            .map((t) => `;${Tl(t)}=${Tl(e[t])}`)
            .join("");
        })(e.parameters)}`;
      }
      const JR = /^[^\/()?;=#]+/;
      function Hs(e) {
        const t = e.match(JR);
        return t ? t[0] : "";
      }
      const ex = /^[^=?&#]+/,
        nx = /^[^&#]+/;
      class ox {
        constructor(t) {
          (this.url = t), (this.remaining = t);
        }
        parseRootSegment() {
          return (
            this.consumeOptional("/"),
            "" === this.remaining ||
            this.peekStartsWith("?") ||
            this.peekStartsWith("#")
              ? new U([], {})
              : new U([], this.parseChildren())
          );
        }
        parseQueryParams() {
          const t = {};
          if (this.consumeOptional("?"))
            do {
              this.parseQueryParam(t);
            } while (this.consumeOptional("&"));
          return t;
        }
        parseFragment() {
          return this.consumeOptional("#")
            ? decodeURIComponent(this.remaining)
            : null;
        }
        parseChildren() {
          if ("" === this.remaining) return {};
          this.consumeOptional("/");
          const t = [];
          for (
            this.peekStartsWith("(") || t.push(this.parseSegment());
            this.peekStartsWith("/") &&
            !this.peekStartsWith("//") &&
            !this.peekStartsWith("/(");

          )
            this.capture("/"), t.push(this.parseSegment());
          let n = {};
          this.peekStartsWith("/(") &&
            (this.capture("/"), (n = this.parseParens(!0)));
          let r = {};
          return (
            this.peekStartsWith("(") && (r = this.parseParens(!1)),
            (t.length > 0 || Object.keys(n).length > 0) && (r[j] = new U(t, n)),
            r
          );
        }
        parseSegment() {
          const t = Hs(this.remaining);
          if ("" === t && this.peekStartsWith(";")) throw new w(4009, js);
          return this.capture(t), new Uo(Us(t), this.parseMatrixParams());
        }
        parseMatrixParams() {
          const t = {};
          for (; this.consumeOptional(";"); ) this.parseParam(t);
          return t;
        }
        parseParam(t) {
          const n = Hs(this.remaining);
          if (!n) return;
          this.capture(n);
          let r = "";
          if (this.consumeOptional("=")) {
            const o = Hs(this.remaining);
            o && ((r = o), this.capture(r));
          }
          t[Us(n)] = Us(r);
        }
        parseQueryParam(t) {
          const n = (function tx(e) {
            const t = e.match(ex);
            return t ? t[0] : "";
          })(this.remaining);
          if (!n) return;
          this.capture(n);
          let r = "";
          if (this.consumeOptional("=")) {
            const s = (function rx(e) {
              const t = e.match(nx);
              return t ? t[0] : "";
            })(this.remaining);
            s && ((r = s), this.capture(r));
          }
          const o = bv(n),
            i = bv(r);
          if (t.hasOwnProperty(o)) {
            let s = t[o];
            Array.isArray(s) || ((s = [s]), (t[o] = s)), s.push(i);
          } else t[o] = i;
        }
        parseParens(t) {
          const n = {};
          for (
            this.capture("(");
            !this.consumeOptional(")") && this.remaining.length > 0;

          ) {
            const r = Hs(this.remaining),
              o = this.remaining[r.length];
            if ("/" !== o && ")" !== o && ";" !== o) throw new w(4010, js);
            let i;
            r.indexOf(":") > -1
              ? ((i = r.slice(0, r.indexOf(":"))),
                this.capture(i),
                this.capture(":"))
              : t && (i = j);
            const s = this.parseChildren();
            (n[i] = 1 === Object.keys(s).length ? s[j] : new U([], s)),
              this.consumeOptional("//");
          }
          return n;
        }
        peekStartsWith(t) {
          return this.remaining.startsWith(t);
        }
        consumeOptional(t) {
          return (
            !!this.peekStartsWith(t) &&
            ((this.remaining = this.remaining.substring(t.length)), !0)
          );
        }
        capture(t) {
          if (!this.consumeOptional(t)) throw new w(4011, js);
        }
      }
      function Al(e) {
        return e.segments.length > 0 ? new U([], { [j]: e }) : e;
      }
      function zs(e) {
        const t = {};
        for (const r of Object.keys(e.children)) {
          const i = zs(e.children[r]);
          (i.segments.length > 0 || i.hasChildren()) && (t[r] = i);
        }
        return (function ix(e) {
          if (1 === e.numberOfChildren && e.children[j]) {
            const t = e.children[j];
            return new U(e.segments.concat(t.segments), t.children);
          }
          return e;
        })(new U(e.segments, t));
      }
      function Hn(e) {
        return e instanceof wn;
      }
      const Rl = !1;
      function sx(e, t, n, r, o) {
        if (0 === n.length) return Fr(t.root, t.root, t.root, r, o);
        const i = (function xv(e) {
          if ("string" == typeof e[0] && 1 === e.length && "/" === e[0])
            return new Rv(!0, 0, e);
          let t = 0,
            n = !1;
          const r = e.reduce((o, i, s) => {
            if ("object" == typeof i && null != i) {
              if (i.outlets) {
                const a = {};
                return (
                  Ae(i.outlets, (u, c) => {
                    a[c] = "string" == typeof u ? u.split("/") : u;
                  }),
                  [...o, { outlets: a }]
                );
              }
              if (i.segmentPath) return [...o, i.segmentPath];
            }
            return "string" != typeof i
              ? [...o, i]
              : 0 === s
              ? (i.split("/").forEach((a, u) => {
                  (0 == u && "." === a) ||
                    (0 == u && "" === a
                      ? (n = !0)
                      : ".." === a
                      ? t++
                      : "" != a && o.push(a));
                }),
                o)
              : [...o, i];
          }, []);
          return new Rv(n, t, r);
        })(n);
        return i.toRoot()
          ? Fr(t.root, t.root, new U([], {}), r, o)
          : (function s(u) {
              const c = (function ux(e, t, n, r) {
                  if (e.isAbsolute) return new kr(t.root, !0, 0);
                  if (-1 === r) return new kr(n, n === t.root, 0);
                  return (function Pv(e, t, n) {
                    let r = e,
                      o = t,
                      i = n;
                    for (; i > o; ) {
                      if (((i -= o), (r = r.parent), !r))
                        throw new w(4005, Rl && "Invalid number of '../'");
                      o = r.segments.length;
                    }
                    return new kr(r, !1, o - i);
                  })(n, r + (Go(e.commands[0]) ? 0 : 1), e.numberOfDoubleDots);
                })(i, t, e.snapshot?._urlSegment, u),
                l = c.processChildren
                  ? Lr(c.segmentGroup, c.index, i.commands)
                  : xl(c.segmentGroup, c.index, i.commands);
              return Fr(t.root, c.segmentGroup, l, r, o);
            })(e.snapshot?._lastPathIndex);
      }
      function Go(e) {
        return (
          "object" == typeof e && null != e && !e.outlets && !e.segmentPath
        );
      }
      function Wo(e) {
        return "object" == typeof e && null != e && e.outlets;
      }
      function Fr(e, t, n, r, o) {
        let s,
          i = {};
        r &&
          Ae(r, (u, c) => {
            i[c] = Array.isArray(u) ? u.map((l) => `${l}`) : `${u}`;
          }),
          (s = e === t ? n : Av(e, t, n));
        const a = Al(zs(s));
        return new wn(a, i, o);
      }
      function Av(e, t, n) {
        const r = {};
        return (
          Ae(e.children, (o, i) => {
            r[i] = o === t ? n : Av(o, t, n);
          }),
          new U(e.segments, r)
        );
      }
      class Rv {
        constructor(t, n, r) {
          if (
            ((this.isAbsolute = t),
            (this.numberOfDoubleDots = n),
            (this.commands = r),
            t && r.length > 0 && Go(r[0]))
          )
            throw new w(
              4003,
              Rl && "Root segment cannot have matrix parameters"
            );
          const o = r.find(Wo);
          if (o && o !== vv(r))
            throw new w(4004, Rl && "{outlets:{}} has to be the last command");
        }
        toRoot() {
          return (
            this.isAbsolute &&
            1 === this.commands.length &&
            "/" == this.commands[0]
          );
        }
      }
      class kr {
        constructor(t, n, r) {
          (this.segmentGroup = t), (this.processChildren = n), (this.index = r);
        }
      }
      function xl(e, t, n) {
        if (
          (e || (e = new U([], {})), 0 === e.segments.length && e.hasChildren())
        )
          return Lr(e, t, n);
        const r = (function lx(e, t, n) {
            let r = 0,
              o = t;
            const i = { match: !1, pathIndex: 0, commandIndex: 0 };
            for (; o < e.segments.length; ) {
              if (r >= n.length) return i;
              const s = e.segments[o],
                a = n[r];
              if (Wo(a)) break;
              const u = `${a}`,
                c = r < n.length - 1 ? n[r + 1] : null;
              if (o > 0 && void 0 === u) break;
              if (u && c && "object" == typeof c && void 0 === c.outlets) {
                if (!Ov(u, c, s)) return i;
                r += 2;
              } else {
                if (!Ov(u, {}, s)) return i;
                r++;
              }
              o++;
            }
            return { match: !0, pathIndex: o, commandIndex: r };
          })(e, t, n),
          o = n.slice(r.commandIndex);
        if (r.match && r.pathIndex < e.segments.length) {
          const i = new U(e.segments.slice(0, r.pathIndex), {});
          return (
            (i.children[j] = new U(e.segments.slice(r.pathIndex), e.children)),
            Lr(i, 0, o)
          );
        }
        return r.match && 0 === o.length
          ? new U(e.segments, {})
          : r.match && !e.hasChildren()
          ? Pl(e, t, n)
          : r.match
          ? Lr(e, 0, o)
          : Pl(e, t, n);
      }
      function Lr(e, t, n) {
        if (0 === n.length) return new U(e.segments, {});
        {
          const r = (function cx(e) {
              return Wo(e[0]) ? e[0].outlets : { [j]: e };
            })(n),
            o = {};
          if (
            !r[j] &&
            e.children[j] &&
            1 === e.numberOfChildren &&
            0 === e.children[j].segments.length
          ) {
            const i = Lr(e.children[j], t, n);
            return new U(e.segments, i.children);
          }
          return (
            Ae(r, (i, s) => {
              "string" == typeof i && (i = [i]),
                null !== i && (o[s] = xl(e.children[s], t, i));
            }),
            Ae(e.children, (i, s) => {
              void 0 === r[s] && (o[s] = i);
            }),
            new U(e.segments, o)
          );
        }
      }
      function Pl(e, t, n) {
        const r = e.segments.slice(0, t);
        let o = 0;
        for (; o < n.length; ) {
          const i = n[o];
          if (Wo(i)) {
            const u = dx(i.outlets);
            return new U(r, u);
          }
          if (0 === o && Go(n[0])) {
            r.push(new Uo(e.segments[t].path, Nv(n[0]))), o++;
            continue;
          }
          const s = Wo(i) ? i.outlets[j] : `${i}`,
            a = o < n.length - 1 ? n[o + 1] : null;
          s && a && Go(a)
            ? (r.push(new Uo(s, Nv(a))), (o += 2))
            : (r.push(new Uo(s, {})), o++);
        }
        return new U(r, {});
      }
      function dx(e) {
        const t = {};
        return (
          Ae(e, (n, r) => {
            "string" == typeof n && (n = [n]),
              null !== n && (t[r] = Pl(new U([], {}), 0, n));
          }),
          t
        );
      }
      function Nv(e) {
        const t = {};
        return Ae(e, (n, r) => (t[r] = `${n}`)), t;
      }
      function Ov(e, t, n) {
        return e == n.path && jt(t, n.parameters);
      }
      const qo = "imperative";
      class $t {
        constructor(t, n) {
          (this.id = t), (this.url = n);
        }
      }
      class Nl extends $t {
        constructor(t, n, r = "imperative", o = null) {
          super(t, n),
            (this.type = 0),
            (this.navigationTrigger = r),
            (this.restoredState = o);
        }
        toString() {
          return `NavigationStart(id: ${this.id}, url: '${this.url}')`;
        }
      }
      class zn extends $t {
        constructor(t, n, r) {
          super(t, n), (this.urlAfterRedirects = r), (this.type = 1);
        }
        toString() {
          return `NavigationEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}')`;
        }
      }
      class Gs extends $t {
        constructor(t, n, r, o) {
          super(t, n), (this.reason = r), (this.code = o), (this.type = 2);
        }
        toString() {
          return `NavigationCancel(id: ${this.id}, url: '${this.url}')`;
        }
      }
      class Ws extends $t {
        constructor(t, n, r, o) {
          super(t, n), (this.reason = r), (this.code = o), (this.type = 16);
        }
      }
      class Ol extends $t {
        constructor(t, n, r, o) {
          super(t, n), (this.error = r), (this.target = o), (this.type = 3);
        }
        toString() {
          return `NavigationError(id: ${this.id}, url: '${this.url}', error: ${this.error})`;
        }
      }
      class fx extends $t {
        constructor(t, n, r, o) {
          super(t, n),
            (this.urlAfterRedirects = r),
            (this.state = o),
            (this.type = 4);
        }
        toString() {
          return `RoutesRecognized(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
        }
      }
      class hx extends $t {
        constructor(t, n, r, o) {
          super(t, n),
            (this.urlAfterRedirects = r),
            (this.state = o),
            (this.type = 7);
        }
        toString() {
          return `GuardsCheckStart(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
        }
      }
      class px extends $t {
        constructor(t, n, r, o, i) {
          super(t, n),
            (this.urlAfterRedirects = r),
            (this.state = o),
            (this.shouldActivate = i),
            (this.type = 8);
        }
        toString() {
          return `GuardsCheckEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state}, shouldActivate: ${this.shouldActivate})`;
        }
      }
      class gx extends $t {
        constructor(t, n, r, o) {
          super(t, n),
            (this.urlAfterRedirects = r),
            (this.state = o),
            (this.type = 5);
        }
        toString() {
          return `ResolveStart(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
        }
      }
      class mx extends $t {
        constructor(t, n, r, o) {
          super(t, n),
            (this.urlAfterRedirects = r),
            (this.state = o),
            (this.type = 6);
        }
        toString() {
          return `ResolveEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
        }
      }
      class yx {
        constructor(t) {
          (this.route = t), (this.type = 9);
        }
        toString() {
          return `RouteConfigLoadStart(path: ${this.route.path})`;
        }
      }
      class vx {
        constructor(t) {
          (this.route = t), (this.type = 10);
        }
        toString() {
          return `RouteConfigLoadEnd(path: ${this.route.path})`;
        }
      }
      class Dx {
        constructor(t) {
          (this.snapshot = t), (this.type = 11);
        }
        toString() {
          return `ChildActivationStart(path: '${
            (this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""
          }')`;
        }
      }
      class wx {
        constructor(t) {
          (this.snapshot = t), (this.type = 12);
        }
        toString() {
          return `ChildActivationEnd(path: '${
            (this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""
          }')`;
        }
      }
      class Cx {
        constructor(t) {
          (this.snapshot = t), (this.type = 13);
        }
        toString() {
          return `ActivationStart(path: '${
            (this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""
          }')`;
        }
      }
      class _x {
        constructor(t) {
          (this.snapshot = t), (this.type = 14);
        }
        toString() {
          return `ActivationEnd(path: '${
            (this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""
          }')`;
        }
      }
      class Fv {
        constructor(t, n, r) {
          (this.routerEvent = t),
            (this.position = n),
            (this.anchor = r),
            (this.type = 15);
        }
        toString() {
          return `Scroll(anchor: '${this.anchor}', position: '${
            this.position ? `${this.position[0]}, ${this.position[1]}` : null
          }')`;
        }
      }
      let bx = (() => {
          class e {
            createUrlTree(n, r, o, i, s, a) {
              return sx(n || r.root, o, i, s, a);
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)();
            }),
            (e.ɵprov = P({ token: e, factory: e.ɵfac })),
            e
          );
        })(),
        Mx = (() => {
          class e {}
          return (
            (e.ɵfac = function (n) {
              return new (n || e)();
            }),
            (e.ɵprov = P({
              token: e,
              factory: function (t) {
                return bx.ɵfac(t);
              },
              providedIn: "root",
            })),
            e
          );
        })();
      class kv {
        constructor(t) {
          this._root = t;
        }
        get root() {
          return this._root.value;
        }
        parent(t) {
          const n = this.pathFromRoot(t);
          return n.length > 1 ? n[n.length - 2] : null;
        }
        children(t) {
          const n = Fl(t, this._root);
          return n ? n.children.map((r) => r.value) : [];
        }
        firstChild(t) {
          const n = Fl(t, this._root);
          return n && n.children.length > 0 ? n.children[0].value : null;
        }
        siblings(t) {
          const n = kl(t, this._root);
          return n.length < 2
            ? []
            : n[n.length - 2].children
                .map((o) => o.value)
                .filter((o) => o !== t);
        }
        pathFromRoot(t) {
          return kl(t, this._root).map((n) => n.value);
        }
      }
      function Fl(e, t) {
        if (e === t.value) return t;
        for (const n of t.children) {
          const r = Fl(e, n);
          if (r) return r;
        }
        return null;
      }
      function kl(e, t) {
        if (e === t.value) return [t];
        for (const n of t.children) {
          const r = kl(e, n);
          if (r.length) return r.unshift(t), r;
        }
        return [];
      }
      class on {
        constructor(t, n) {
          (this.value = t), (this.children = n);
        }
        toString() {
          return `TreeNode(${this.value})`;
        }
      }
      function jr(e) {
        const t = {};
        return e && e.children.forEach((n) => (t[n.value.outlet] = n)), t;
      }
      class Lv extends kv {
        constructor(t, n) {
          super(t), (this.snapshot = n), Ll(this, t);
        }
        toString() {
          return this.snapshot.toString();
        }
      }
      function jv(e, t) {
        const n = (function Tx(e, t) {
            const s = new qs([], {}, {}, "", {}, j, t, null, e.root, -1, {});
            return new Vv("", new on(s, []));
          })(e, t),
          r = new St([new Uo("", {})]),
          o = new St({}),
          i = new St({}),
          s = new St({}),
          a = new St(""),
          u = new Gn(r, o, s, a, i, j, t, n.root);
        return (u.snapshot = n.root), new Lv(new on(u, []), n);
      }
      class Gn {
        constructor(t, n, r, o, i, s, a, u) {
          (this.url = t),
            (this.params = n),
            (this.queryParams = r),
            (this.fragment = o),
            (this.data = i),
            (this.outlet = s),
            (this.component = a),
            (this.title = this.data?.pipe(G((c) => c[Bo])) ?? T(void 0)),
            (this._futureSnapshot = u);
        }
        get routeConfig() {
          return this._futureSnapshot.routeConfig;
        }
        get root() {
          return this._routerState.root;
        }
        get parent() {
          return this._routerState.parent(this);
        }
        get firstChild() {
          return this._routerState.firstChild(this);
        }
        get children() {
          return this._routerState.children(this);
        }
        get pathFromRoot() {
          return this._routerState.pathFromRoot(this);
        }
        get paramMap() {
          return (
            this._paramMap ||
              (this._paramMap = this.params.pipe(G((t) => Or(t)))),
            this._paramMap
          );
        }
        get queryParamMap() {
          return (
            this._queryParamMap ||
              (this._queryParamMap = this.queryParams.pipe(G((t) => Or(t)))),
            this._queryParamMap
          );
        }
        toString() {
          return this.snapshot
            ? this.snapshot.toString()
            : `Future(${this._futureSnapshot})`;
        }
      }
      function $v(e, t = "emptyOnly") {
        const n = e.pathFromRoot;
        let r = 0;
        if ("always" !== t)
          for (r = n.length - 1; r >= 1; ) {
            const o = n[r],
              i = n[r - 1];
            if (o.routeConfig && "" === o.routeConfig.path) r--;
            else {
              if (i.component) break;
              r--;
            }
          }
        return (function Ax(e) {
          return e.reduce(
            (t, n) => ({
              params: { ...t.params, ...n.params },
              data: { ...t.data, ...n.data },
              resolve: {
                ...n.data,
                ...t.resolve,
                ...n.routeConfig?.data,
                ...n._resolvedData,
              },
            }),
            { params: {}, data: {}, resolve: {} }
          );
        })(n.slice(r));
      }
      class qs {
        get title() {
          return this.data?.[Bo];
        }
        constructor(t, n, r, o, i, s, a, u, c, l, d) {
          (this.url = t),
            (this.params = n),
            (this.queryParams = r),
            (this.fragment = o),
            (this.data = i),
            (this.outlet = s),
            (this.component = a),
            (this.routeConfig = u),
            (this._urlSegment = c),
            (this._lastPathIndex = l),
            (this._resolve = d);
        }
        get root() {
          return this._routerState.root;
        }
        get parent() {
          return this._routerState.parent(this);
        }
        get firstChild() {
          return this._routerState.firstChild(this);
        }
        get children() {
          return this._routerState.children(this);
        }
        get pathFromRoot() {
          return this._routerState.pathFromRoot(this);
        }
        get paramMap() {
          return (
            this._paramMap || (this._paramMap = Or(this.params)), this._paramMap
          );
        }
        get queryParamMap() {
          return (
            this._queryParamMap || (this._queryParamMap = Or(this.queryParams)),
            this._queryParamMap
          );
        }
        toString() {
          return `Route(url:'${this.url
            .map((r) => r.toString())
            .join("/")}', path:'${
            this.routeConfig ? this.routeConfig.path : ""
          }')`;
        }
      }
      class Vv extends kv {
        constructor(t, n) {
          super(n), (this.url = t), Ll(this, n);
        }
        toString() {
          return Bv(this._root);
        }
      }
      function Ll(e, t) {
        (t.value._routerState = e), t.children.forEach((n) => Ll(e, n));
      }
      function Bv(e) {
        const t =
          e.children.length > 0 ? ` { ${e.children.map(Bv).join(", ")} } ` : "";
        return `${e.value}${t}`;
      }
      function jl(e) {
        if (e.snapshot) {
          const t = e.snapshot,
            n = e._futureSnapshot;
          (e.snapshot = n),
            jt(t.queryParams, n.queryParams) ||
              e.queryParams.next(n.queryParams),
            t.fragment !== n.fragment && e.fragment.next(n.fragment),
            jt(t.params, n.params) || e.params.next(n.params),
            (function HR(e, t) {
              if (e.length !== t.length) return !1;
              for (let n = 0; n < e.length; ++n) if (!jt(e[n], t[n])) return !1;
              return !0;
            })(t.url, n.url) || e.url.next(n.url),
            jt(t.data, n.data) || e.data.next(n.data);
        } else
          (e.snapshot = e._futureSnapshot), e.data.next(e._futureSnapshot.data);
      }
      function $l(e, t) {
        const n =
          jt(e.params, t.params) &&
          (function qR(e, t) {
            return (
              Un(e, t) && e.every((n, r) => jt(n.parameters, t[r].parameters))
            );
          })(e.url, t.url);
        return (
          n &&
          !(!e.parent != !t.parent) &&
          (!e.parent || $l(e.parent, t.parent))
        );
      }
      function Zo(e, t, n) {
        if (n && e.shouldReuseRoute(t.value, n.value.snapshot)) {
          const r = n.value;
          r._futureSnapshot = t.value;
          const o = (function xx(e, t, n) {
            return t.children.map((r) => {
              for (const o of n.children)
                if (e.shouldReuseRoute(r.value, o.value.snapshot))
                  return Zo(e, r, o);
              return Zo(e, r);
            });
          })(e, t, n);
          return new on(r, o);
        }
        {
          if (e.shouldAttach(t.value)) {
            const i = e.retrieve(t.value);
            if (null !== i) {
              const s = i.route;
              return (
                (s.value._futureSnapshot = t.value),
                (s.children = t.children.map((a) => Zo(e, a))),
                s
              );
            }
          }
          const r = (function Px(e) {
              return new Gn(
                new St(e.url),
                new St(e.params),
                new St(e.queryParams),
                new St(e.fragment),
                new St(e.data),
                e.outlet,
                e.component,
                e
              );
            })(t.value),
            o = t.children.map((i) => Zo(e, i));
          return new on(r, o);
        }
      }
      const Vl = "ngNavigationCancelingError";
      function Uv(e, t) {
        const { redirectTo: n, navigationBehaviorOptions: r } = Hn(t)
            ? { redirectTo: t, navigationBehaviorOptions: void 0 }
            : t,
          o = Hv(!1, 0, t);
        return (o.url = n), (o.navigationBehaviorOptions = r), o;
      }
      function Hv(e, t, n) {
        const r = new Error("NavigationCancelingError: " + (e || ""));
        return (r[Vl] = !0), (r.cancellationCode = t), n && (r.url = n), r;
      }
      function zv(e) {
        return Gv(e) && Hn(e.url);
      }
      function Gv(e) {
        return e && e[Vl];
      }
      class Nx {
        constructor() {
          (this.outlet = null),
            (this.route = null),
            (this.resolver = null),
            (this.injector = null),
            (this.children = new Qo()),
            (this.attachRef = null);
        }
      }
      let Qo = (() => {
        class e {
          constructor() {
            this.contexts = new Map();
          }
          onChildOutletCreated(n, r) {
            const o = this.getOrCreateContext(n);
            (o.outlet = r), this.contexts.set(n, o);
          }
          onChildOutletDestroyed(n) {
            const r = this.getContext(n);
            r && ((r.outlet = null), (r.attachRef = null));
          }
          onOutletDeactivated() {
            const n = this.contexts;
            return (this.contexts = new Map()), n;
          }
          onOutletReAttached(n) {
            this.contexts = n;
          }
          getOrCreateContext(n) {
            let r = this.getContext(n);
            return r || ((r = new Nx()), this.contexts.set(n, r)), r;
          }
          getContext(n) {
            return this.contexts.get(n) || null;
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)();
          }),
          (e.ɵprov = P({ token: e, factory: e.ɵfac, providedIn: "root" })),
          e
        );
      })();
      const Zs = !1;
      let Bl = (() => {
        class e {
          constructor() {
            (this.activated = null),
              (this._activatedRoute = null),
              (this.name = j),
              (this.activateEvents = new Be()),
              (this.deactivateEvents = new Be()),
              (this.attachEvents = new Be()),
              (this.detachEvents = new Be()),
              (this.parentContexts = H(Qo)),
              (this.location = H(wt)),
              (this.changeDetector = H(Uc)),
              (this.environmentInjector = H(Qt));
          }
          ngOnChanges(n) {
            if (n.name) {
              const { firstChange: r, previousValue: o } = n.name;
              if (r) return;
              this.isTrackedInParentContexts(o) &&
                (this.deactivate(),
                this.parentContexts.onChildOutletDestroyed(o)),
                this.initializeOutletWithName();
            }
          }
          ngOnDestroy() {
            this.isTrackedInParentContexts(this.name) &&
              this.parentContexts.onChildOutletDestroyed(this.name);
          }
          isTrackedInParentContexts(n) {
            return this.parentContexts.getContext(n)?.outlet === this;
          }
          ngOnInit() {
            this.initializeOutletWithName();
          }
          initializeOutletWithName() {
            if (
              (this.parentContexts.onChildOutletCreated(this.name, this),
              this.activated)
            )
              return;
            const n = this.parentContexts.getContext(this.name);
            n?.route &&
              (n.attachRef
                ? this.attach(n.attachRef, n.route)
                : this.activateWith(n.route, n.injector));
          }
          get isActivated() {
            return !!this.activated;
          }
          get component() {
            if (!this.activated) throw new w(4012, Zs);
            return this.activated.instance;
          }
          get activatedRoute() {
            if (!this.activated) throw new w(4012, Zs);
            return this._activatedRoute;
          }
          get activatedRouteData() {
            return this._activatedRoute
              ? this._activatedRoute.snapshot.data
              : {};
          }
          detach() {
            if (!this.activated) throw new w(4012, Zs);
            this.location.detach();
            const n = this.activated;
            return (
              (this.activated = null),
              (this._activatedRoute = null),
              this.detachEvents.emit(n.instance),
              n
            );
          }
          attach(n, r) {
            (this.activated = n),
              (this._activatedRoute = r),
              this.location.insert(n.hostView),
              this.attachEvents.emit(n.instance);
          }
          deactivate() {
            if (this.activated) {
              const n = this.component;
              this.activated.destroy(),
                (this.activated = null),
                (this._activatedRoute = null),
                this.deactivateEvents.emit(n);
            }
          }
          activateWith(n, r) {
            if (this.isActivated) throw new w(4013, Zs);
            this._activatedRoute = n;
            const o = this.location,
              s = n.snapshot.component,
              a = this.parentContexts.getOrCreateContext(this.name).children,
              u = new Ox(n, a, o.injector);
            if (
              r &&
              (function Fx(e) {
                return !!e.resolveComponentFactory;
              })(r)
            ) {
              const c = r.resolveComponentFactory(s);
              this.activated = o.createComponent(c, o.length, u);
            } else
              this.activated = o.createComponent(s, {
                index: o.length,
                injector: u,
                environmentInjector: r ?? this.environmentInjector,
              });
            this.changeDetector.markForCheck(),
              this.activateEvents.emit(this.activated.instance);
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)();
          }),
          (e.ɵdir = ke({
            type: e,
            selectors: [["router-outlet"]],
            inputs: { name: "name" },
            outputs: {
              activateEvents: "activate",
              deactivateEvents: "deactivate",
              attachEvents: "attach",
              detachEvents: "detach",
            },
            exportAs: ["outlet"],
            standalone: !0,
            features: [Tn],
          })),
          e
        );
      })();
      class Ox {
        constructor(t, n, r) {
          (this.route = t), (this.childContexts = n), (this.parent = r);
        }
        get(t, n) {
          return t === Gn
            ? this.route
            : t === Qo
            ? this.childContexts
            : this.parent.get(t, n);
        }
      }
      let Ul = (() => {
        class e {}
        return (
          (e.ɵfac = function (n) {
            return new (n || e)();
          }),
          (e.ɵcmp = Kr({
            type: e,
            selectors: [["ng-component"]],
            standalone: !0,
            features: [em],
            decls: 1,
            vars: 0,
            template: function (n, r) {
              1 & n && Ir(0, "router-outlet");
            },
            dependencies: [Bl],
            encapsulation: 2,
          })),
          e
        );
      })();
      function Wv(e, t) {
        return (
          e.providers &&
            !e._injector &&
            (e._injector = ls(e.providers, t, `Route: ${e.path}`)),
          e._injector ?? t
        );
      }
      function zl(e) {
        const t = e.children && e.children.map(zl),
          n = t ? { ...e, children: t } : { ...e };
        return (
          !n.component &&
            !n.loadComponent &&
            (t || n.loadChildren) &&
            n.outlet &&
            n.outlet !== j &&
            (n.component = Ul),
          n
        );
      }
      function ht(e) {
        return e.outlet || j;
      }
      function qv(e, t) {
        const n = e.filter((r) => ht(r) === t);
        return n.push(...e.filter((r) => ht(r) !== t)), n;
      }
      function Yo(e) {
        if (!e) return null;
        if (e.routeConfig?._injector) return e.routeConfig._injector;
        for (let t = e.parent; t; t = t.parent) {
          const n = t.routeConfig;
          if (n?._loadedInjector) return n._loadedInjector;
          if (n?._injector) return n._injector;
        }
        return null;
      }
      class Vx {
        constructor(t, n, r, o) {
          (this.routeReuseStrategy = t),
            (this.futureState = n),
            (this.currState = r),
            (this.forwardEvent = o);
        }
        activate(t) {
          const n = this.futureState._root,
            r = this.currState ? this.currState._root : null;
          this.deactivateChildRoutes(n, r, t),
            jl(this.futureState.root),
            this.activateChildRoutes(n, r, t);
        }
        deactivateChildRoutes(t, n, r) {
          const o = jr(n);
          t.children.forEach((i) => {
            const s = i.value.outlet;
            this.deactivateRoutes(i, o[s], r), delete o[s];
          }),
            Ae(o, (i, s) => {
              this.deactivateRouteAndItsChildren(i, r);
            });
        }
        deactivateRoutes(t, n, r) {
          const o = t.value,
            i = n ? n.value : null;
          if (o === i)
            if (o.component) {
              const s = r.getContext(o.outlet);
              s && this.deactivateChildRoutes(t, n, s.children);
            } else this.deactivateChildRoutes(t, n, r);
          else i && this.deactivateRouteAndItsChildren(n, r);
        }
        deactivateRouteAndItsChildren(t, n) {
          t.value.component &&
          this.routeReuseStrategy.shouldDetach(t.value.snapshot)
            ? this.detachAndStoreRouteSubtree(t, n)
            : this.deactivateRouteAndOutlet(t, n);
        }
        detachAndStoreRouteSubtree(t, n) {
          const r = n.getContext(t.value.outlet),
            o = r && t.value.component ? r.children : n,
            i = jr(t);
          for (const s of Object.keys(i))
            this.deactivateRouteAndItsChildren(i[s], o);
          if (r && r.outlet) {
            const s = r.outlet.detach(),
              a = r.children.onOutletDeactivated();
            this.routeReuseStrategy.store(t.value.snapshot, {
              componentRef: s,
              route: t,
              contexts: a,
            });
          }
        }
        deactivateRouteAndOutlet(t, n) {
          const r = n.getContext(t.value.outlet),
            o = r && t.value.component ? r.children : n,
            i = jr(t);
          for (const s of Object.keys(i))
            this.deactivateRouteAndItsChildren(i[s], o);
          r &&
            (r.outlet &&
              (r.outlet.deactivate(), r.children.onOutletDeactivated()),
            (r.attachRef = null),
            (r.resolver = null),
            (r.route = null));
        }
        activateChildRoutes(t, n, r) {
          const o = jr(n);
          t.children.forEach((i) => {
            this.activateRoutes(i, o[i.value.outlet], r),
              this.forwardEvent(new _x(i.value.snapshot));
          }),
            t.children.length && this.forwardEvent(new wx(t.value.snapshot));
        }
        activateRoutes(t, n, r) {
          const o = t.value,
            i = n ? n.value : null;
          if ((jl(o), o === i))
            if (o.component) {
              const s = r.getOrCreateContext(o.outlet);
              this.activateChildRoutes(t, n, s.children);
            } else this.activateChildRoutes(t, n, r);
          else if (o.component) {
            const s = r.getOrCreateContext(o.outlet);
            if (this.routeReuseStrategy.shouldAttach(o.snapshot)) {
              const a = this.routeReuseStrategy.retrieve(o.snapshot);
              this.routeReuseStrategy.store(o.snapshot, null),
                s.children.onOutletReAttached(a.contexts),
                (s.attachRef = a.componentRef),
                (s.route = a.route.value),
                s.outlet && s.outlet.attach(a.componentRef, a.route.value),
                jl(a.route.value),
                this.activateChildRoutes(t, null, s.children);
            } else {
              const a = Yo(o.snapshot),
                u = a?.get(Do) ?? null;
              (s.attachRef = null),
                (s.route = o),
                (s.resolver = u),
                (s.injector = a),
                s.outlet && s.outlet.activateWith(o, s.injector),
                this.activateChildRoutes(t, null, s.children);
            }
          } else this.activateChildRoutes(t, null, r);
        }
      }
      class Zv {
        constructor(t) {
          (this.path = t), (this.route = this.path[this.path.length - 1]);
        }
      }
      class Qs {
        constructor(t, n) {
          (this.component = t), (this.route = n);
        }
      }
      function Bx(e, t, n) {
        const r = e._root;
        return Ko(r, t ? t._root : null, n, [r.value]);
      }
      function $r(e, t) {
        const n = Symbol(),
          r = t.get(e, n);
        return r === n
          ? "function" != typeof e ||
            (function xw(e) {
              return null !== ci(e);
            })(e)
            ? t.get(e)
            : e
          : r;
      }
      function Ko(
        e,
        t,
        n,
        r,
        o = { canDeactivateChecks: [], canActivateChecks: [] }
      ) {
        const i = jr(t);
        return (
          e.children.forEach((s) => {
            (function Hx(
              e,
              t,
              n,
              r,
              o = { canDeactivateChecks: [], canActivateChecks: [] }
            ) {
              const i = e.value,
                s = t ? t.value : null,
                a = n ? n.getContext(e.value.outlet) : null;
              if (s && i.routeConfig === s.routeConfig) {
                const u = (function zx(e, t, n) {
                  if ("function" == typeof n) return n(e, t);
                  switch (n) {
                    case "pathParamsChange":
                      return !Un(e.url, t.url);
                    case "pathParamsOrQueryParamsChange":
                      return (
                        !Un(e.url, t.url) || !jt(e.queryParams, t.queryParams)
                      );
                    case "always":
                      return !0;
                    case "paramsOrQueryParamsChange":
                      return !$l(e, t) || !jt(e.queryParams, t.queryParams);
                    default:
                      return !$l(e, t);
                  }
                })(s, i, i.routeConfig.runGuardsAndResolvers);
                u
                  ? o.canActivateChecks.push(new Zv(r))
                  : ((i.data = s.data), (i._resolvedData = s._resolvedData)),
                  Ko(e, t, i.component ? (a ? a.children : null) : n, r, o),
                  u &&
                    a &&
                    a.outlet &&
                    a.outlet.isActivated &&
                    o.canDeactivateChecks.push(new Qs(a.outlet.component, s));
              } else
                s && Xo(t, a, o),
                  o.canActivateChecks.push(new Zv(r)),
                  Ko(e, null, i.component ? (a ? a.children : null) : n, r, o);
            })(s, i[s.value.outlet], n, r.concat([s.value]), o),
              delete i[s.value.outlet];
          }),
          Ae(i, (s, a) => Xo(s, n.getContext(a), o)),
          o
        );
      }
      function Xo(e, t, n) {
        const r = jr(e),
          o = e.value;
        Ae(r, (i, s) => {
          Xo(i, o.component ? (t ? t.children.getContext(s) : null) : t, n);
        }),
          n.canDeactivateChecks.push(
            new Qs(
              o.component && t && t.outlet && t.outlet.isActivated
                ? t.outlet.component
                : null,
              o
            )
          );
      }
      function Jo(e) {
        return "function" == typeof e;
      }
      function Gl(e) {
        return e instanceof ks || "EmptyError" === e?.name;
      }
      const Ys = Symbol("INITIAL_VALUE");
      function Vr() {
        return Lt((e) =>
          cv(
            e.map((t) =>
              t.pipe(
                Nr(1),
                (function kR(...e) {
                  const t = Wr(e);
                  return Ee((n, r) => {
                    (t ? El(e, n, t) : El(e, n)).subscribe(r);
                  });
                })(Ys)
              )
            )
          ).pipe(
            G((t) => {
              for (const n of t)
                if (!0 !== n) {
                  if (n === Ys) return Ys;
                  if (!1 === n || n instanceof wn) return n;
                }
              return !0;
            }),
            mn((t) => t !== Ys),
            Nr(1)
          )
        );
      }
      function Qv(e) {
        return (function ND(...e) {
          return sd(e);
        })(
          Fe((t) => {
            if (Hn(t)) throw Uv(0, t);
          }),
          G((t) => !0 === t)
        );
      }
      const Wl = {
        matched: !1,
        consumedSegments: [],
        remainingSegments: [],
        parameters: {},
        positionalParamSegments: {},
      };
      function Yv(e, t, n, r, o) {
        const i = ql(e, t, n);
        return i.matched
          ? (function aP(e, t, n, r) {
              const o = t.canMatch;
              return o && 0 !== o.length
                ? T(
                    o.map((s) => {
                      const a = $r(s, e);
                      return Dn(
                        (function Yx(e) {
                          return e && Jo(e.canMatch);
                        })(a)
                          ? a.canMatch(t, n)
                          : e.runInContext(() => a(t, n))
                      );
                    })
                  ).pipe(Vr(), Qv())
                : T(!0);
            })((r = Wv(t, r)), t, n).pipe(G((s) => (!0 === s ? i : { ...Wl })))
          : T(i);
      }
      function ql(e, t, n) {
        if ("" === t.path)
          return "full" === t.pathMatch && (e.hasChildren() || n.length > 0)
            ? { ...Wl }
            : {
                matched: !0,
                consumedSegments: [],
                remainingSegments: n,
                parameters: {},
                positionalParamSegments: {},
              };
        const o = (t.matcher || UR)(n, e, t);
        if (!o) return { ...Wl };
        const i = {};
        Ae(o.posParams, (a, u) => {
          i[u] = a.path;
        });
        const s =
          o.consumed.length > 0
            ? { ...i, ...o.consumed[o.consumed.length - 1].parameters }
            : i;
        return {
          matched: !0,
          consumedSegments: o.consumed,
          remainingSegments: n.slice(o.consumed.length),
          parameters: s,
          positionalParamSegments: o.posParams ?? {},
        };
      }
      function Ks(e, t, n, r) {
        if (
          n.length > 0 &&
          (function lP(e, t, n) {
            return n.some((r) => Xs(e, t, r) && ht(r) !== j);
          })(e, n, r)
        ) {
          const i = new U(
            t,
            (function cP(e, t, n, r) {
              const o = {};
              (o[j] = r),
                (r._sourceSegment = e),
                (r._segmentIndexShift = t.length);
              for (const i of n)
                if ("" === i.path && ht(i) !== j) {
                  const s = new U([], {});
                  (s._sourceSegment = e),
                    (s._segmentIndexShift = t.length),
                    (o[ht(i)] = s);
                }
              return o;
            })(e, t, r, new U(n, e.children))
          );
          return (
            (i._sourceSegment = e),
            (i._segmentIndexShift = t.length),
            { segmentGroup: i, slicedSegments: [] }
          );
        }
        if (
          0 === n.length &&
          (function dP(e, t, n) {
            return n.some((r) => Xs(e, t, r));
          })(e, n, r)
        ) {
          const i = new U(
            e.segments,
            (function uP(e, t, n, r, o) {
              const i = {};
              for (const s of r)
                if (Xs(e, n, s) && !o[ht(s)]) {
                  const a = new U([], {});
                  (a._sourceSegment = e),
                    (a._segmentIndexShift = t.length),
                    (i[ht(s)] = a);
                }
              return { ...o, ...i };
            })(e, t, n, r, e.children)
          );
          return (
            (i._sourceSegment = e),
            (i._segmentIndexShift = t.length),
            { segmentGroup: i, slicedSegments: n }
          );
        }
        const o = new U(e.segments, e.children);
        return (
          (o._sourceSegment = e),
          (o._segmentIndexShift = t.length),
          { segmentGroup: o, slicedSegments: n }
        );
      }
      function Xs(e, t, n) {
        return (
          (!(e.hasChildren() || t.length > 0) || "full" !== n.pathMatch) &&
          "" === n.path
        );
      }
      function Kv(e, t, n, r) {
        return (
          !!(ht(e) === r || (r !== j && Xs(t, n, e))) &&
          ("**" === e.path || ql(t, e, n).matched)
        );
      }
      function Xv(e, t, n) {
        return 0 === t.length && !e.children[n];
      }
      const Js = !1;
      class ea {
        constructor(t) {
          this.segmentGroup = t || null;
        }
      }
      class Jv {
        constructor(t) {
          this.urlTree = t;
        }
      }
      function ei(e) {
        return Vo(new ea(e));
      }
      function eD(e) {
        return Vo(new Jv(e));
      }
      class gP {
        constructor(t, n, r, o, i) {
          (this.injector = t),
            (this.configLoader = n),
            (this.urlSerializer = r),
            (this.urlTree = o),
            (this.config = i),
            (this.allowRedirects = !0);
        }
        apply() {
          const t = Ks(this.urlTree.root, [], [], this.config).segmentGroup,
            n = new U(t.segments, t.children);
          return this.expandSegmentGroup(this.injector, this.config, n, j)
            .pipe(
              G((i) =>
                this.createUrlTree(
                  zs(i),
                  this.urlTree.queryParams,
                  this.urlTree.fragment
                )
              )
            )
            .pipe(
              vn((i) => {
                if (i instanceof Jv)
                  return (this.allowRedirects = !1), this.match(i.urlTree);
                throw i instanceof ea ? this.noMatchError(i) : i;
              })
            );
        }
        match(t) {
          return this.expandSegmentGroup(this.injector, this.config, t.root, j)
            .pipe(
              G((o) => this.createUrlTree(zs(o), t.queryParams, t.fragment))
            )
            .pipe(
              vn((o) => {
                throw o instanceof ea ? this.noMatchError(o) : o;
              })
            );
        }
        noMatchError(t) {
          return new w(4002, Js);
        }
        createUrlTree(t, n, r) {
          const o = Al(t);
          return new wn(o, n, r);
        }
        expandSegmentGroup(t, n, r, o) {
          return 0 === r.segments.length && r.hasChildren()
            ? this.expandChildren(t, n, r).pipe(G((i) => new U([], i)))
            : this.expandSegment(t, r, n, r.segments, o, !0);
        }
        expandChildren(t, n, r) {
          const o = [];
          for (const i of Object.keys(r.children))
            "primary" === i ? o.unshift(i) : o.push(i);
          return De(o).pipe(
            Bn((i) => {
              const s = r.children[i],
                a = qv(n, i);
              return this.expandSegmentGroup(t, a, s, i).pipe(
                G((u) => ({ segment: u, outlet: i }))
              );
            }),
            pv((i, s) => ((i[s.outlet] = s.segment), i), {}),
            gv()
          );
        }
        expandSegment(t, n, r, o, i, s) {
          return De(r).pipe(
            Bn((a) =>
              this.expandSegmentAgainstRoute(t, n, r, a, o, i, s).pipe(
                vn((c) => {
                  if (c instanceof ea) return T(null);
                  throw c;
                })
              )
            ),
            yn((a) => !!a),
            vn((a, u) => {
              if (Gl(a)) return Xv(n, o, i) ? T(new U([], {})) : ei(n);
              throw a;
            })
          );
        }
        expandSegmentAgainstRoute(t, n, r, o, i, s, a) {
          return Kv(o, n, i, s)
            ? void 0 === o.redirectTo
              ? this.matchSegmentAgainstRoute(t, n, o, i, s)
              : a && this.allowRedirects
              ? this.expandSegmentAgainstRouteUsingRedirect(t, n, r, o, i, s)
              : ei(n)
            : ei(n);
        }
        expandSegmentAgainstRouteUsingRedirect(t, n, r, o, i, s) {
          return "**" === o.path
            ? this.expandWildCardWithParamsAgainstRouteUsingRedirect(t, r, o, s)
            : this.expandRegularSegmentAgainstRouteUsingRedirect(
                t,
                n,
                r,
                o,
                i,
                s
              );
        }
        expandWildCardWithParamsAgainstRouteUsingRedirect(t, n, r, o) {
          const i = this.applyRedirectCommands([], r.redirectTo, {});
          return r.redirectTo.startsWith("/")
            ? eD(i)
            : this.lineralizeSegments(r, i).pipe(
                be((s) => {
                  const a = new U(s, {});
                  return this.expandSegment(t, a, n, s, o, !1);
                })
              );
        }
        expandRegularSegmentAgainstRouteUsingRedirect(t, n, r, o, i, s) {
          const {
            matched: a,
            consumedSegments: u,
            remainingSegments: c,
            positionalParamSegments: l,
          } = ql(n, o, i);
          if (!a) return ei(n);
          const d = this.applyRedirectCommands(u, o.redirectTo, l);
          return o.redirectTo.startsWith("/")
            ? eD(d)
            : this.lineralizeSegments(o, d).pipe(
                be((f) => this.expandSegment(t, n, r, f.concat(c), s, !1))
              );
        }
        matchSegmentAgainstRoute(t, n, r, o, i) {
          return "**" === r.path
            ? ((t = Wv(r, t)),
              r.loadChildren
                ? (r._loadedRoutes
                    ? T({
                        routes: r._loadedRoutes,
                        injector: r._loadedInjector,
                      })
                    : this.configLoader.loadChildren(t, r)
                  ).pipe(
                    G(
                      (a) => (
                        (r._loadedRoutes = a.routes),
                        (r._loadedInjector = a.injector),
                        new U(o, {})
                      )
                    )
                  )
                : T(new U(o, {})))
            : Yv(n, r, o, t).pipe(
                Lt(
                  ({ matched: s, consumedSegments: a, remainingSegments: u }) =>
                    s
                      ? this.getChildConfig((t = r._injector ?? t), r, o).pipe(
                          be((l) => {
                            const d = l.injector ?? t,
                              f = l.routes,
                              { segmentGroup: h, slicedSegments: p } = Ks(
                                n,
                                a,
                                u,
                                f
                              ),
                              g = new U(h.segments, h.children);
                            if (0 === p.length && g.hasChildren())
                              return this.expandChildren(d, f, g).pipe(
                                G((m) => new U(a, m))
                              );
                            if (0 === f.length && 0 === p.length)
                              return T(new U(a, {}));
                            const y = ht(r) === i;
                            return this.expandSegment(
                              d,
                              g,
                              f,
                              p,
                              y ? j : i,
                              !0
                            ).pipe(
                              G((_) => new U(a.concat(_.segments), _.children))
                            );
                          })
                        )
                      : ei(n)
                )
              );
        }
        getChildConfig(t, n, r) {
          return n.children
            ? T({ routes: n.children, injector: t })
            : n.loadChildren
            ? void 0 !== n._loadedRoutes
              ? T({ routes: n._loadedRoutes, injector: n._loadedInjector })
              : (function sP(e, t, n, r) {
                  const o = t.canLoad;
                  return void 0 === o || 0 === o.length
                    ? T(!0)
                    : T(
                        o.map((s) => {
                          const a = $r(s, e);
                          return Dn(
                            (function Wx(e) {
                              return e && Jo(e.canLoad);
                            })(a)
                              ? a.canLoad(t, n)
                              : e.runInContext(() => a(t, n))
                          );
                        })
                      ).pipe(Vr(), Qv());
                })(t, n, r).pipe(
                  be((o) =>
                    o
                      ? this.configLoader.loadChildren(t, n).pipe(
                          Fe((i) => {
                            (n._loadedRoutes = i.routes),
                              (n._loadedInjector = i.injector);
                          })
                        )
                      : (function hP(e) {
                          return Vo(Hv(Js, 3));
                        })()
                  )
                )
            : T({ routes: [], injector: t });
        }
        lineralizeSegments(t, n) {
          let r = [],
            o = n.root;
          for (;;) {
            if (((r = r.concat(o.segments)), 0 === o.numberOfChildren))
              return T(r);
            if (o.numberOfChildren > 1 || !o.children[j])
              return t.redirectTo, Vo(new w(4e3, Js));
            o = o.children[j];
          }
        }
        applyRedirectCommands(t, n, r) {
          return this.applyRedirectCreateUrlTree(
            n,
            this.urlSerializer.parse(n),
            t,
            r
          );
        }
        applyRedirectCreateUrlTree(t, n, r, o) {
          const i = this.createSegmentGroup(t, n.root, r, o);
          return new wn(
            i,
            this.createQueryParams(n.queryParams, this.urlTree.queryParams),
            n.fragment
          );
        }
        createQueryParams(t, n) {
          const r = {};
          return (
            Ae(t, (o, i) => {
              if ("string" == typeof o && o.startsWith(":")) {
                const a = o.substring(1);
                r[i] = n[a];
              } else r[i] = o;
            }),
            r
          );
        }
        createSegmentGroup(t, n, r, o) {
          const i = this.createSegments(t, n.segments, r, o);
          let s = {};
          return (
            Ae(n.children, (a, u) => {
              s[u] = this.createSegmentGroup(t, a, r, o);
            }),
            new U(i, s)
          );
        }
        createSegments(t, n, r, o) {
          return n.map((i) =>
            i.path.startsWith(":")
              ? this.findPosParam(t, i, o)
              : this.findOrReturn(i, r)
          );
        }
        findPosParam(t, n, r) {
          const o = r[n.path.substring(1)];
          if (!o) throw new w(4001, Js);
          return o;
        }
        findOrReturn(t, n) {
          let r = 0;
          for (const o of n) {
            if (o.path === t.path) return n.splice(r), o;
            r++;
          }
          return t;
        }
      }
      class yP {}
      class wP {
        constructor(t, n, r, o, i, s, a) {
          (this.injector = t),
            (this.rootComponentType = n),
            (this.config = r),
            (this.urlTree = o),
            (this.url = i),
            (this.paramsInheritanceStrategy = s),
            (this.urlSerializer = a);
        }
        recognize() {
          const t = Ks(
            this.urlTree.root,
            [],
            [],
            this.config.filter((n) => void 0 === n.redirectTo)
          ).segmentGroup;
          return this.processSegmentGroup(
            this.injector,
            this.config,
            t,
            j
          ).pipe(
            G((n) => {
              if (null === n) return null;
              const r = new qs(
                  [],
                  Object.freeze({}),
                  Object.freeze({ ...this.urlTree.queryParams }),
                  this.urlTree.fragment,
                  {},
                  j,
                  this.rootComponentType,
                  null,
                  this.urlTree.root,
                  -1,
                  {}
                ),
                o = new on(r, n),
                i = new Vv(this.url, o);
              return this.inheritParamsAndData(i._root), i;
            })
          );
        }
        inheritParamsAndData(t) {
          const n = t.value,
            r = $v(n, this.paramsInheritanceStrategy);
          (n.params = Object.freeze(r.params)),
            (n.data = Object.freeze(r.data)),
            t.children.forEach((o) => this.inheritParamsAndData(o));
        }
        processSegmentGroup(t, n, r, o) {
          return 0 === r.segments.length && r.hasChildren()
            ? this.processChildren(t, n, r)
            : this.processSegment(t, n, r, r.segments, o);
        }
        processChildren(t, n, r) {
          return De(Object.keys(r.children)).pipe(
            Bn((o) => {
              const i = r.children[o],
                s = qv(n, o);
              return this.processSegmentGroup(t, s, i, o);
            }),
            pv((o, i) => (o && i ? (o.push(...i), o) : null)),
            (function $R(e, t = !1) {
              return Ee((n, r) => {
                let o = 0;
                n.subscribe(
                  Se(r, (i) => {
                    const s = e(i, o++);
                    (s || t) && r.next(i), !s && r.complete();
                  })
                );
              });
            })((o) => null !== o),
            Ls(null),
            gv(),
            G((o) => {
              if (null === o) return null;
              const i = nD(o);
              return (
                (function CP(e) {
                  e.sort((t, n) =>
                    t.value.outlet === j
                      ? -1
                      : n.value.outlet === j
                      ? 1
                      : t.value.outlet.localeCompare(n.value.outlet)
                  );
                })(i),
                i
              );
            })
          );
        }
        processSegment(t, n, r, o, i) {
          return De(n).pipe(
            Bn((s) =>
              this.processSegmentAgainstRoute(s._injector ?? t, s, r, o, i)
            ),
            yn((s) => !!s),
            vn((s) => {
              if (Gl(s)) return Xv(r, o, i) ? T([]) : T(null);
              throw s;
            })
          );
        }
        processSegmentAgainstRoute(t, n, r, o, i) {
          if (n.redirectTo || !Kv(n, r, o, i)) return T(null);
          let s;
          if ("**" === n.path) {
            const a = o.length > 0 ? vv(o).parameters : {},
              u = oD(r) + o.length;
            s = T({
              snapshot: new qs(
                o,
                a,
                Object.freeze({ ...this.urlTree.queryParams }),
                this.urlTree.fragment,
                iD(n),
                ht(n),
                n.component ?? n._loadedComponent ?? null,
                n,
                rD(r),
                u,
                sD(n)
              ),
              consumedSegments: [],
              remainingSegments: [],
            });
          } else
            s = Yv(r, n, o, t).pipe(
              G(
                ({
                  matched: a,
                  consumedSegments: u,
                  remainingSegments: c,
                  parameters: l,
                }) => {
                  if (!a) return null;
                  const d = oD(r) + u.length;
                  return {
                    snapshot: new qs(
                      u,
                      l,
                      Object.freeze({ ...this.urlTree.queryParams }),
                      this.urlTree.fragment,
                      iD(n),
                      ht(n),
                      n.component ?? n._loadedComponent ?? null,
                      n,
                      rD(r),
                      d,
                      sD(n)
                    ),
                    consumedSegments: u,
                    remainingSegments: c,
                  };
                }
              )
            );
          return s.pipe(
            Lt((a) => {
              if (null === a) return T(null);
              const {
                snapshot: u,
                consumedSegments: c,
                remainingSegments: l,
              } = a;
              t = n._injector ?? t;
              const d = n._loadedInjector ?? t,
                f = (function _P(e) {
                  return e.children
                    ? e.children
                    : e.loadChildren
                    ? e._loadedRoutes
                    : [];
                })(n),
                { segmentGroup: h, slicedSegments: p } = Ks(
                  r,
                  c,
                  l,
                  f.filter((y) => void 0 === y.redirectTo)
                );
              if (0 === p.length && h.hasChildren())
                return this.processChildren(d, f, h).pipe(
                  G((y) => (null === y ? null : [new on(u, y)]))
                );
              if (0 === f.length && 0 === p.length) return T([new on(u, [])]);
              const g = ht(n) === i;
              return this.processSegment(d, f, h, p, g ? j : i).pipe(
                G((y) => (null === y ? null : [new on(u, y)]))
              );
            })
          );
        }
      }
      function EP(e) {
        const t = e.value.routeConfig;
        return t && "" === t.path && void 0 === t.redirectTo;
      }
      function nD(e) {
        const t = [],
          n = new Set();
        for (const r of e) {
          if (!EP(r)) {
            t.push(r);
            continue;
          }
          const o = t.find((i) => r.value.routeConfig === i.value.routeConfig);
          void 0 !== o ? (o.children.push(...r.children), n.add(o)) : t.push(r);
        }
        for (const r of n) {
          const o = nD(r.children);
          t.push(new on(r.value, o));
        }
        return t.filter((r) => !n.has(r));
      }
      function rD(e) {
        let t = e;
        for (; t._sourceSegment; ) t = t._sourceSegment;
        return t;
      }
      function oD(e) {
        let t = e,
          n = t._segmentIndexShift ?? 0;
        for (; t._sourceSegment; )
          (t = t._sourceSegment), (n += t._segmentIndexShift ?? 0);
        return n - 1;
      }
      function iD(e) {
        return e.data || {};
      }
      function sD(e) {
        return e.resolve || {};
      }
      function aD(e) {
        return "string" == typeof e.title || null === e.title;
      }
      function Zl(e) {
        return Lt((t) => {
          const n = e(t);
          return n ? De(n).pipe(G(() => t)) : T(t);
        });
      }
      const Br = new N("ROUTES");
      let Ql = (() => {
        class e {
          constructor() {
            (this.componentLoaders = new WeakMap()),
              (this.childrenLoaders = new WeakMap()),
              (this.compiler = H(Hm));
          }
          loadComponent(n) {
            if (this.componentLoaders.get(n))
              return this.componentLoaders.get(n);
            if (n._loadedComponent) return T(n._loadedComponent);
            this.onLoadStartListener && this.onLoadStartListener(n);
            const r = Dn(n.loadComponent()).pipe(
                G(cD),
                Fe((i) => {
                  this.onLoadEndListener && this.onLoadEndListener(n),
                    (n._loadedComponent = i);
                }),
                Il(() => {
                  this.componentLoaders.delete(n);
                })
              ),
              o = new fv(r, () => new Vt()).pipe(Sl());
            return this.componentLoaders.set(n, o), o;
          }
          loadChildren(n, r) {
            if (this.childrenLoaders.get(r)) return this.childrenLoaders.get(r);
            if (r._loadedRoutes)
              return T({
                routes: r._loadedRoutes,
                injector: r._loadedInjector,
              });
            this.onLoadStartListener && this.onLoadStartListener(r);
            const i = this.loadModuleFactoryOrRoutes(r.loadChildren).pipe(
                G((a) => {
                  this.onLoadEndListener && this.onLoadEndListener(r);
                  let u,
                    c,
                    l = !1;
                  Array.isArray(a)
                    ? (c = a)
                    : ((u = a.create(n).injector),
                      (c = yv(u.get(Br, [], R.Self | R.Optional))));
                  return { routes: c.map(zl), injector: u };
                }),
                Il(() => {
                  this.childrenLoaders.delete(r);
                })
              ),
              s = new fv(i, () => new Vt()).pipe(Sl());
            return this.childrenLoaders.set(r, s), s;
          }
          loadModuleFactoryOrRoutes(n) {
            return Dn(n()).pipe(
              G(cD),
              be((r) =>
                r instanceof Xg || Array.isArray(r)
                  ? T(r)
                  : De(this.compiler.compileModuleAsync(r))
              )
            );
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)();
          }),
          (e.ɵprov = P({ token: e, factory: e.ɵfac, providedIn: "root" })),
          e
        );
      })();
      function cD(e) {
        return (function xP(e) {
          return e && "object" == typeof e && "default" in e;
        })(e)
          ? e.default
          : e;
      }
      let na = (() => {
        class e {
          get hasRequestedNavigation() {
            return 0 !== this.navigationId;
          }
          constructor() {
            (this.currentNavigation = null),
              (this.lastSuccessfulNavigation = null),
              (this.events = new Vt()),
              (this.configLoader = H(Ql)),
              (this.environmentInjector = H(Qt)),
              (this.urlSerializer = H(Ho)),
              (this.rootContexts = H(Qo)),
              (this.navigationId = 0),
              (this.afterPreactivation = () => T(void 0)),
              (this.rootComponentType = null),
              (this.configLoader.onLoadEndListener = (o) =>
                this.events.next(new vx(o))),
              (this.configLoader.onLoadStartListener = (o) =>
                this.events.next(new yx(o)));
          }
          complete() {
            this.transitions?.complete();
          }
          handleNavigationRequest(n) {
            const r = ++this.navigationId;
            this.transitions?.next({ ...this.transitions.value, ...n, id: r });
          }
          setupNavigations(n) {
            return (
              (this.transitions = new St({
                id: 0,
                targetPageId: 0,
                currentUrlTree: n.currentUrlTree,
                currentRawUrl: n.currentUrlTree,
                extractedUrl: n.urlHandlingStrategy.extract(n.currentUrlTree),
                urlAfterRedirects: n.urlHandlingStrategy.extract(
                  n.currentUrlTree
                ),
                rawUrl: n.currentUrlTree,
                extras: {},
                resolve: null,
                reject: null,
                promise: Promise.resolve(!0),
                source: qo,
                restoredState: null,
                currentSnapshot: n.routerState.snapshot,
                targetSnapshot: null,
                currentRouterState: n.routerState,
                targetRouterState: null,
                guards: { canActivateChecks: [], canDeactivateChecks: [] },
                guardsResult: null,
              })),
              this.transitions.pipe(
                mn((r) => 0 !== r.id),
                G((r) => ({
                  ...r,
                  extractedUrl: n.urlHandlingStrategy.extract(r.rawUrl),
                })),
                Lt((r) => {
                  let o = !1,
                    i = !1;
                  return T(r).pipe(
                    Fe((s) => {
                      this.currentNavigation = {
                        id: s.id,
                        initialUrl: s.rawUrl,
                        extractedUrl: s.extractedUrl,
                        trigger: s.source,
                        extras: s.extras,
                        previousNavigation: this.lastSuccessfulNavigation
                          ? {
                              ...this.lastSuccessfulNavigation,
                              previousNavigation: null,
                            }
                          : null,
                      };
                    }),
                    Lt((s) => {
                      const a = n.browserUrlTree.toString(),
                        u =
                          !n.navigated ||
                          s.extractedUrl.toString() !== a ||
                          a !== n.currentUrlTree.toString();
                      if (
                        !u &&
                        "reload" !==
                          (s.extras.onSameUrlNavigation ??
                            n.onSameUrlNavigation)
                      ) {
                        const l = "";
                        return (
                          this.events.next(
                            new Ws(s.id, n.serializeUrl(r.rawUrl), l, 0)
                          ),
                          (n.rawUrlTree = s.rawUrl),
                          s.resolve(null),
                          It
                        );
                      }
                      if (n.urlHandlingStrategy.shouldProcessUrl(s.rawUrl))
                        return (
                          lD(s.source) && (n.browserUrlTree = s.extractedUrl),
                          T(s).pipe(
                            Lt((l) => {
                              const d = this.transitions?.getValue();
                              return (
                                this.events.next(
                                  new Nl(
                                    l.id,
                                    this.urlSerializer.serialize(
                                      l.extractedUrl
                                    ),
                                    l.source,
                                    l.restoredState
                                  )
                                ),
                                d !== this.transitions?.getValue()
                                  ? It
                                  : Promise.resolve(l)
                              );
                            }),
                            (function mP(e, t, n, r) {
                              return Lt((o) =>
                                (function pP(e, t, n, r, o) {
                                  return new gP(e, t, n, r, o).apply();
                                })(e, t, n, o.extractedUrl, r).pipe(
                                  G((i) => ({ ...o, urlAfterRedirects: i }))
                                )
                              );
                            })(
                              this.environmentInjector,
                              this.configLoader,
                              this.urlSerializer,
                              n.config
                            ),
                            Fe((l) => {
                              (this.currentNavigation = {
                                ...this.currentNavigation,
                                finalUrl: l.urlAfterRedirects,
                              }),
                                (r.urlAfterRedirects = l.urlAfterRedirects);
                            }),
                            (function bP(e, t, n, r, o) {
                              return be((i) =>
                                (function DP(
                                  e,
                                  t,
                                  n,
                                  r,
                                  o,
                                  i,
                                  s = "emptyOnly"
                                ) {
                                  return new wP(e, t, n, r, o, s, i)
                                    .recognize()
                                    .pipe(
                                      Lt((a) =>
                                        null === a
                                          ? (function vP(e) {
                                              return new ve((t) => t.error(e));
                                            })(new yP())
                                          : T(a)
                                      )
                                    );
                                })(
                                  e,
                                  t,
                                  n,
                                  i.urlAfterRedirects,
                                  r.serialize(i.urlAfterRedirects),
                                  r,
                                  o
                                ).pipe(G((s) => ({ ...i, targetSnapshot: s })))
                              );
                            })(
                              this.environmentInjector,
                              this.rootComponentType,
                              n.config,
                              this.urlSerializer,
                              n.paramsInheritanceStrategy
                            ),
                            Fe((l) => {
                              if (
                                ((r.targetSnapshot = l.targetSnapshot),
                                "eager" === n.urlUpdateStrategy)
                              ) {
                                if (!l.extras.skipLocationChange) {
                                  const f = n.urlHandlingStrategy.merge(
                                    l.urlAfterRedirects,
                                    l.rawUrl
                                  );
                                  n.setBrowserUrl(f, l);
                                }
                                n.browserUrlTree = l.urlAfterRedirects;
                              }
                              const d = new fx(
                                l.id,
                                this.urlSerializer.serialize(l.extractedUrl),
                                this.urlSerializer.serialize(
                                  l.urlAfterRedirects
                                ),
                                l.targetSnapshot
                              );
                              this.events.next(d);
                            })
                          )
                        );
                      if (
                        u &&
                        n.urlHandlingStrategy.shouldProcessUrl(n.rawUrlTree)
                      ) {
                        const {
                            id: l,
                            extractedUrl: d,
                            source: f,
                            restoredState: h,
                            extras: p,
                          } = s,
                          g = new Nl(l, this.urlSerializer.serialize(d), f, h);
                        this.events.next(g);
                        const y = jv(d, this.rootComponentType).snapshot;
                        return T(
                          (r = {
                            ...s,
                            targetSnapshot: y,
                            urlAfterRedirects: d,
                            extras: {
                              ...p,
                              skipLocationChange: !1,
                              replaceUrl: !1,
                            },
                          })
                        );
                      }
                      {
                        const l = "";
                        return (
                          this.events.next(
                            new Ws(s.id, n.serializeUrl(r.extractedUrl), l, 1)
                          ),
                          (n.rawUrlTree = s.rawUrl),
                          s.resolve(null),
                          It
                        );
                      }
                    }),
                    Fe((s) => {
                      const a = new hx(
                        s.id,
                        this.urlSerializer.serialize(s.extractedUrl),
                        this.urlSerializer.serialize(s.urlAfterRedirects),
                        s.targetSnapshot
                      );
                      this.events.next(a);
                    }),
                    G(
                      (s) =>
                        (r = {
                          ...s,
                          guards: Bx(
                            s.targetSnapshot,
                            s.currentSnapshot,
                            this.rootContexts
                          ),
                        })
                    ),
                    (function Xx(e, t) {
                      return be((n) => {
                        const {
                          targetSnapshot: r,
                          currentSnapshot: o,
                          guards: {
                            canActivateChecks: i,
                            canDeactivateChecks: s,
                          },
                        } = n;
                        return 0 === s.length && 0 === i.length
                          ? T({ ...n, guardsResult: !0 })
                          : (function Jx(e, t, n, r) {
                              return De(e).pipe(
                                be((o) =>
                                  (function iP(e, t, n, r, o) {
                                    const i =
                                      t && t.routeConfig
                                        ? t.routeConfig.canDeactivate
                                        : null;
                                    return i && 0 !== i.length
                                      ? T(
                                          i.map((a) => {
                                            const u = Yo(t) ?? o,
                                              c = $r(a, u);
                                            return Dn(
                                              (function Qx(e) {
                                                return e && Jo(e.canDeactivate);
                                              })(c)
                                                ? c.canDeactivate(e, t, n, r)
                                                : u.runInContext(() =>
                                                    c(e, t, n, r)
                                                  )
                                            ).pipe(yn());
                                          })
                                        ).pipe(Vr())
                                      : T(!0);
                                  })(o.component, o.route, n, t, r)
                                ),
                                yn((o) => !0 !== o, !0)
                              );
                            })(s, r, o, e).pipe(
                              be((a) =>
                                a &&
                                (function Gx(e) {
                                  return "boolean" == typeof e;
                                })(a)
                                  ? (function eP(e, t, n, r) {
                                      return De(t).pipe(
                                        Bn((o) =>
                                          El(
                                            (function nP(e, t) {
                                              return (
                                                null !== e && t && t(new Dx(e)),
                                                T(!0)
                                              );
                                            })(o.route.parent, r),
                                            (function tP(e, t) {
                                              return (
                                                null !== e && t && t(new Cx(e)),
                                                T(!0)
                                              );
                                            })(o.route, r),
                                            (function oP(e, t, n) {
                                              const r = t[t.length - 1],
                                                i = t
                                                  .slice(0, t.length - 1)
                                                  .reverse()
                                                  .map((s) =>
                                                    (function Ux(e) {
                                                      const t = e.routeConfig
                                                        ? e.routeConfig
                                                            .canActivateChild
                                                        : null;
                                                      return t && 0 !== t.length
                                                        ? { node: e, guards: t }
                                                        : null;
                                                    })(s)
                                                  )
                                                  .filter((s) => null !== s)
                                                  .map((s) =>
                                                    dv(() =>
                                                      T(
                                                        s.guards.map((u) => {
                                                          const c =
                                                              Yo(s.node) ?? n,
                                                            l = $r(u, c);
                                                          return Dn(
                                                            (function Zx(e) {
                                                              return (
                                                                e &&
                                                                Jo(
                                                                  e.canActivateChild
                                                                )
                                                              );
                                                            })(l)
                                                              ? l.canActivateChild(
                                                                  r,
                                                                  e
                                                                )
                                                              : c.runInContext(
                                                                  () => l(r, e)
                                                                )
                                                          ).pipe(yn());
                                                        })
                                                      ).pipe(Vr())
                                                    )
                                                  );
                                              return T(i).pipe(Vr());
                                            })(e, o.path, n),
                                            (function rP(e, t, n) {
                                              const r = t.routeConfig
                                                ? t.routeConfig.canActivate
                                                : null;
                                              if (!r || 0 === r.length)
                                                return T(!0);
                                              const o = r.map((i) =>
                                                dv(() => {
                                                  const s = Yo(t) ?? n,
                                                    a = $r(i, s);
                                                  return Dn(
                                                    (function qx(e) {
                                                      return (
                                                        e && Jo(e.canActivate)
                                                      );
                                                    })(a)
                                                      ? a.canActivate(t, e)
                                                      : s.runInContext(() =>
                                                          a(t, e)
                                                        )
                                                  ).pipe(yn());
                                                })
                                              );
                                              return T(o).pipe(Vr());
                                            })(e, o.route, n)
                                          )
                                        ),
                                        yn((o) => !0 !== o, !0)
                                      );
                                    })(r, i, e, t)
                                  : T(a)
                              ),
                              G((a) => ({ ...n, guardsResult: a }))
                            );
                      });
                    })(this.environmentInjector, (s) => this.events.next(s)),
                    Fe((s) => {
                      if (
                        ((r.guardsResult = s.guardsResult), Hn(s.guardsResult))
                      )
                        throw Uv(0, s.guardsResult);
                      const a = new px(
                        s.id,
                        this.urlSerializer.serialize(s.extractedUrl),
                        this.urlSerializer.serialize(s.urlAfterRedirects),
                        s.targetSnapshot,
                        !!s.guardsResult
                      );
                      this.events.next(a);
                    }),
                    mn(
                      (s) =>
                        !!s.guardsResult ||
                        (n.restoreHistory(s),
                        this.cancelNavigationTransition(s, "", 3),
                        !1)
                    ),
                    Zl((s) => {
                      if (s.guards.canActivateChecks.length)
                        return T(s).pipe(
                          Fe((a) => {
                            const u = new gx(
                              a.id,
                              this.urlSerializer.serialize(a.extractedUrl),
                              this.urlSerializer.serialize(a.urlAfterRedirects),
                              a.targetSnapshot
                            );
                            this.events.next(u);
                          }),
                          Lt((a) => {
                            let u = !1;
                            return T(a).pipe(
                              (function IP(e, t) {
                                return be((n) => {
                                  const {
                                    targetSnapshot: r,
                                    guards: { canActivateChecks: o },
                                  } = n;
                                  if (!o.length) return T(n);
                                  let i = 0;
                                  return De(o).pipe(
                                    Bn((s) =>
                                      (function MP(e, t, n, r) {
                                        const o = e.routeConfig,
                                          i = e._resolve;
                                        return (
                                          void 0 !== o?.title &&
                                            !aD(o) &&
                                            (i[Bo] = o.title),
                                          (function TP(e, t, n, r) {
                                            const o = (function AP(e) {
                                              return [
                                                ...Object.keys(e),
                                                ...Object.getOwnPropertySymbols(
                                                  e
                                                ),
                                              ];
                                            })(e);
                                            if (0 === o.length) return T({});
                                            const i = {};
                                            return De(o).pipe(
                                              be((s) =>
                                                (function RP(e, t, n, r) {
                                                  const o = Yo(t) ?? r,
                                                    i = $r(e, o);
                                                  return Dn(
                                                    i.resolve
                                                      ? i.resolve(t, n)
                                                      : o.runInContext(() =>
                                                          i(t, n)
                                                        )
                                                  );
                                                })(e[s], t, n, r).pipe(
                                                  yn(),
                                                  Fe((a) => {
                                                    i[s] = a;
                                                  })
                                                )
                                              ),
                                              bl(1),
                                              (function VR(e) {
                                                return G(() => e);
                                              })(i),
                                              vn((s) => (Gl(s) ? It : Vo(s)))
                                            );
                                          })(i, e, t, r).pipe(
                                            G(
                                              (s) => (
                                                (e._resolvedData = s),
                                                (e.data = $v(e, n).resolve),
                                                o &&
                                                  aD(o) &&
                                                  (e.data[Bo] = o.title),
                                                null
                                              )
                                            )
                                          )
                                        );
                                      })(s.route, r, e, t)
                                    ),
                                    Fe(() => i++),
                                    bl(1),
                                    be((s) => (i === o.length ? T(n) : It))
                                  );
                                });
                              })(
                                n.paramsInheritanceStrategy,
                                this.environmentInjector
                              ),
                              Fe({
                                next: () => (u = !0),
                                complete: () => {
                                  u ||
                                    (n.restoreHistory(a),
                                    this.cancelNavigationTransition(a, "", 2));
                                },
                              })
                            );
                          }),
                          Fe((a) => {
                            const u = new mx(
                              a.id,
                              this.urlSerializer.serialize(a.extractedUrl),
                              this.urlSerializer.serialize(a.urlAfterRedirects),
                              a.targetSnapshot
                            );
                            this.events.next(u);
                          })
                        );
                    }),
                    Zl((s) => {
                      const a = (u) => {
                        const c = [];
                        u.routeConfig?.loadComponent &&
                          !u.routeConfig._loadedComponent &&
                          c.push(
                            this.configLoader.loadComponent(u.routeConfig).pipe(
                              Fe((l) => {
                                u.component = l;
                              }),
                              G(() => {})
                            )
                          );
                        for (const l of u.children) c.push(...a(l));
                        return c;
                      };
                      return cv(a(s.targetSnapshot.root)).pipe(Ls(), Nr(1));
                    }),
                    Zl(() => this.afterPreactivation()),
                    G((s) => {
                      const a = (function Rx(e, t, n) {
                        const r = Zo(e, t._root, n ? n._root : void 0);
                        return new Lv(r, t);
                      })(
                        n.routeReuseStrategy,
                        s.targetSnapshot,
                        s.currentRouterState
                      );
                      return (r = { ...s, targetRouterState: a });
                    }),
                    Fe((s) => {
                      (n.currentUrlTree = s.urlAfterRedirects),
                        (n.rawUrlTree = n.urlHandlingStrategy.merge(
                          s.urlAfterRedirects,
                          s.rawUrl
                        )),
                        (n.routerState = s.targetRouterState),
                        "deferred" === n.urlUpdateStrategy &&
                          (s.extras.skipLocationChange ||
                            n.setBrowserUrl(n.rawUrlTree, s),
                          (n.browserUrlTree = s.urlAfterRedirects));
                    }),
                    ((e, t, n) =>
                      G(
                        (r) => (
                          new Vx(
                            t,
                            r.targetRouterState,
                            r.currentRouterState,
                            n
                          ).activate(e),
                          r
                        )
                      ))(this.rootContexts, n.routeReuseStrategy, (s) =>
                      this.events.next(s)
                    ),
                    Nr(1),
                    Fe({
                      next: (s) => {
                        (o = !0),
                          (this.lastSuccessfulNavigation =
                            this.currentNavigation),
                          (n.navigated = !0),
                          this.events.next(
                            new zn(
                              s.id,
                              this.urlSerializer.serialize(s.extractedUrl),
                              this.urlSerializer.serialize(n.currentUrlTree)
                            )
                          ),
                          n.titleStrategy?.updateTitle(
                            s.targetRouterState.snapshot
                          ),
                          s.resolve(!0);
                      },
                      complete: () => {
                        o = !0;
                      },
                    }),
                    Il(() => {
                      o || i || this.cancelNavigationTransition(r, "", 1),
                        this.currentNavigation?.id === r.id &&
                          (this.currentNavigation = null);
                    }),
                    vn((s) => {
                      if (((i = !0), Gv(s))) {
                        zv(s) || ((n.navigated = !0), n.restoreHistory(r, !0));
                        const a = new Gs(
                          r.id,
                          this.urlSerializer.serialize(r.extractedUrl),
                          s.message,
                          s.cancellationCode
                        );
                        if ((this.events.next(a), zv(s))) {
                          const u = n.urlHandlingStrategy.merge(
                              s.url,
                              n.rawUrlTree
                            ),
                            c = {
                              skipLocationChange: r.extras.skipLocationChange,
                              replaceUrl:
                                "eager" === n.urlUpdateStrategy || lD(r.source),
                            };
                          n.scheduleNavigation(u, qo, null, c, {
                            resolve: r.resolve,
                            reject: r.reject,
                            promise: r.promise,
                          });
                        } else r.resolve(!1);
                      } else {
                        n.restoreHistory(r, !0);
                        const a = new Ol(
                          r.id,
                          this.urlSerializer.serialize(r.extractedUrl),
                          s,
                          r.targetSnapshot ?? void 0
                        );
                        this.events.next(a);
                        try {
                          r.resolve(n.errorHandler(s));
                        } catch (u) {
                          r.reject(u);
                        }
                      }
                      return It;
                    })
                  );
                })
              )
            );
          }
          cancelNavigationTransition(n, r, o) {
            const i = new Gs(
              n.id,
              this.urlSerializer.serialize(n.extractedUrl),
              r,
              o
            );
            this.events.next(i), n.resolve(!1);
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)();
          }),
          (e.ɵprov = P({ token: e, factory: e.ɵfac, providedIn: "root" })),
          e
        );
      })();
      function lD(e) {
        return e !== qo;
      }
      let dD = (() => {
          class e {
            buildTitle(n) {
              let r,
                o = n.root;
              for (; void 0 !== o; )
                (r = this.getResolvedTitleForRoute(o) ?? r),
                  (o = o.children.find((i) => i.outlet === j));
              return r;
            }
            getResolvedTitleForRoute(n) {
              return n.data[Bo];
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)();
            }),
            (e.ɵprov = P({
              token: e,
              factory: function () {
                return H(PP);
              },
              providedIn: "root",
            })),
            e
          );
        })(),
        PP = (() => {
          class e extends dD {
            constructor(n) {
              super(), (this.title = n);
            }
            updateTitle(n) {
              const r = this.buildTitle(n);
              void 0 !== r && this.title.setTitle(r);
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)(x(sv));
            }),
            (e.ɵprov = P({ token: e, factory: e.ɵfac, providedIn: "root" })),
            e
          );
        })(),
        NP = (() => {
          class e {}
          return (
            (e.ɵfac = function (n) {
              return new (n || e)();
            }),
            (e.ɵprov = P({
              token: e,
              factory: function () {
                return H(FP);
              },
              providedIn: "root",
            })),
            e
          );
        })();
      class OP {
        shouldDetach(t) {
          return !1;
        }
        store(t, n) {}
        shouldAttach(t) {
          return !1;
        }
        retrieve(t) {
          return null;
        }
        shouldReuseRoute(t, n) {
          return t.routeConfig === n.routeConfig;
        }
      }
      let FP = (() => {
        class e extends OP {}
        return (
          (e.ɵfac = (function () {
            let t;
            return function (r) {
              return (
                t ||
                (t = (function Sf(e) {
                  return Ut(() => {
                    const t = e.prototype.constructor,
                      n = t[zt] || qa(t),
                      r = Object.prototype;
                    let o = Object.getPrototypeOf(e.prototype).constructor;
                    for (; o && o !== r; ) {
                      const i = o[zt] || qa(o);
                      if (i && i !== n) return i;
                      o = Object.getPrototypeOf(o);
                    }
                    return (i) => new i();
                  });
                })(e))
              )(r || e);
            };
          })()),
          (e.ɵprov = P({ token: e, factory: e.ɵfac, providedIn: "root" })),
          e
        );
      })();
      const ra = new N("", { providedIn: "root", factory: () => ({}) });
      let LP = (() => {
          class e {}
          return (
            (e.ɵfac = function (n) {
              return new (n || e)();
            }),
            (e.ɵprov = P({
              token: e,
              factory: function () {
                return H(jP);
              },
              providedIn: "root",
            })),
            e
          );
        })(),
        jP = (() => {
          class e {
            shouldProcessUrl(n) {
              return !0;
            }
            extract(n) {
              return n;
            }
            merge(n, r) {
              return n;
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)();
            }),
            (e.ɵprov = P({ token: e, factory: e.ɵfac, providedIn: "root" })),
            e
          );
        })();
      function $P(e) {
        throw e;
      }
      function VP(e, t, n) {
        return t.parse("/");
      }
      const BP = {
          paths: "exact",
          fragment: "ignored",
          matrixParams: "ignored",
          queryParams: "exact",
        },
        UP = {
          paths: "subset",
          fragment: "ignored",
          matrixParams: "ignored",
          queryParams: "subset",
        };
      let He = (() => {
        class e {
          get navigationId() {
            return this.navigationTransitions.navigationId;
          }
          get browserPageId() {
            if ("computed" === this.canceledNavigationResolution)
              return this.location.getState()?.ɵrouterPageId;
          }
          get events() {
            return this.navigationTransitions.events;
          }
          constructor() {
            (this.disposed = !1),
              (this.currentPageId = 0),
              (this.console = H(lM)),
              (this.isNgZoneEnabled = !1),
              (this.options = H(ra, { optional: !0 }) || {}),
              (this.errorHandler = this.options.errorHandler || $P),
              (this.malformedUriErrorHandler =
                this.options.malformedUriErrorHandler || VP),
              (this.navigated = !1),
              (this.lastSuccessfulId = -1),
              (this.urlHandlingStrategy = H(LP)),
              (this.routeReuseStrategy = H(NP)),
              (this.urlCreationStrategy = H(Mx)),
              (this.titleStrategy = H(dD)),
              (this.onSameUrlNavigation =
                this.options.onSameUrlNavigation || "ignore"),
              (this.paramsInheritanceStrategy =
                this.options.paramsInheritanceStrategy || "emptyOnly"),
              (this.urlUpdateStrategy =
                this.options.urlUpdateStrategy || "deferred"),
              (this.canceledNavigationResolution =
                this.options.canceledNavigationResolution || "replace"),
              (this.config = yv(H(Br, { optional: !0 }) ?? [])),
              (this.navigationTransitions = H(na)),
              (this.urlSerializer = H(Ho)),
              (this.location = H(Kc)),
              (this.isNgZoneEnabled =
                H(de) instanceof de && de.isInAngularZone()),
              this.resetConfig(this.config),
              (this.currentUrlTree = new wn()),
              (this.rawUrlTree = this.currentUrlTree),
              (this.browserUrlTree = this.currentUrlTree),
              (this.routerState = jv(this.currentUrlTree, null)),
              this.navigationTransitions.setupNavigations(this).subscribe(
                (n) => {
                  (this.lastSuccessfulId = n.id),
                    (this.currentPageId = this.browserPageId ?? 0);
                },
                (n) => {
                  this.console.warn(`Unhandled Navigation Error: ${n}`);
                }
              );
          }
          resetRootComponentType(n) {
            (this.routerState.root.component = n),
              (this.navigationTransitions.rootComponentType = n);
          }
          initialNavigation() {
            if (
              (this.setUpLocationChangeListener(),
              !this.navigationTransitions.hasRequestedNavigation)
            ) {
              const n = this.location.getState();
              this.navigateToSyncWithBrowser(this.location.path(!0), qo, n);
            }
          }
          setUpLocationChangeListener() {
            this.locationSubscription ||
              (this.locationSubscription = this.location.subscribe((n) => {
                const r = "popstate" === n.type ? "popstate" : "hashchange";
                "popstate" === r &&
                  setTimeout(() => {
                    this.navigateToSyncWithBrowser(n.url, r, n.state);
                  }, 0);
              }));
          }
          navigateToSyncWithBrowser(n, r, o) {
            const i = { replaceUrl: !0 },
              s = o?.navigationId ? o : null;
            if (o) {
              const u = { ...o };
              delete u.navigationId,
                delete u.ɵrouterPageId,
                0 !== Object.keys(u).length && (i.state = u);
            }
            const a = this.parseUrl(n);
            this.scheduleNavigation(a, r, s, i);
          }
          get url() {
            return this.serializeUrl(this.currentUrlTree);
          }
          getCurrentNavigation() {
            return this.navigationTransitions.currentNavigation;
          }
          resetConfig(n) {
            (this.config = n.map(zl)),
              (this.navigated = !1),
              (this.lastSuccessfulId = -1);
          }
          ngOnDestroy() {
            this.dispose();
          }
          dispose() {
            this.navigationTransitions.complete(),
              this.locationSubscription &&
                (this.locationSubscription.unsubscribe(),
                (this.locationSubscription = void 0)),
              (this.disposed = !0);
          }
          createUrlTree(n, r = {}) {
            const {
                relativeTo: o,
                queryParams: i,
                fragment: s,
                queryParamsHandling: a,
                preserveFragment: u,
              } = r,
              c = u ? this.currentUrlTree.fragment : s;
            let l = null;
            switch (a) {
              case "merge":
                l = { ...this.currentUrlTree.queryParams, ...i };
                break;
              case "preserve":
                l = this.currentUrlTree.queryParams;
                break;
              default:
                l = i || null;
            }
            return (
              null !== l && (l = this.removeEmptyProps(l)),
              this.urlCreationStrategy.createUrlTree(
                o,
                this.routerState,
                this.currentUrlTree,
                n,
                l,
                c ?? null
              )
            );
          }
          navigateByUrl(n, r = { skipLocationChange: !1 }) {
            const o = Hn(n) ? n : this.parseUrl(n),
              i = this.urlHandlingStrategy.merge(o, this.rawUrlTree);
            return this.scheduleNavigation(i, qo, null, r);
          }
          navigate(n, r = { skipLocationChange: !1 }) {
            return (
              (function HP(e) {
                for (let t = 0; t < e.length; t++) {
                  const n = e[t];
                  if (null == n) throw new w(4008, false);
                }
              })(n),
              this.navigateByUrl(this.createUrlTree(n, r), r)
            );
          }
          serializeUrl(n) {
            return this.urlSerializer.serialize(n);
          }
          parseUrl(n) {
            let r;
            try {
              r = this.urlSerializer.parse(n);
            } catch (o) {
              r = this.malformedUriErrorHandler(o, this.urlSerializer, n);
            }
            return r;
          }
          isActive(n, r) {
            let o;
            if (((o = !0 === r ? { ...BP } : !1 === r ? { ...UP } : r), Hn(n)))
              return wv(this.currentUrlTree, n, o);
            const i = this.parseUrl(n);
            return wv(this.currentUrlTree, i, o);
          }
          removeEmptyProps(n) {
            return Object.keys(n).reduce((r, o) => {
              const i = n[o];
              return null != i && (r[o] = i), r;
            }, {});
          }
          scheduleNavigation(n, r, o, i, s) {
            if (this.disposed) return Promise.resolve(!1);
            let a, u, c, l;
            return (
              s
                ? ((a = s.resolve), (u = s.reject), (c = s.promise))
                : (c = new Promise((d, f) => {
                    (a = d), (u = f);
                  })),
              (l =
                "computed" === this.canceledNavigationResolution
                  ? o && o.ɵrouterPageId
                    ? o.ɵrouterPageId
                    : (this.browserPageId ?? 0) + 1
                  : 0),
              this.navigationTransitions.handleNavigationRequest({
                targetPageId: l,
                source: r,
                restoredState: o,
                currentUrlTree: this.currentUrlTree,
                currentRawUrl: this.currentUrlTree,
                rawUrl: n,
                extras: i,
                resolve: a,
                reject: u,
                promise: c,
                currentSnapshot: this.routerState.snapshot,
                currentRouterState: this.routerState,
              }),
              c.catch((d) => Promise.reject(d))
            );
          }
          setBrowserUrl(n, r) {
            const o = this.urlSerializer.serialize(n);
            if (this.location.isCurrentPathEqualTo(o) || r.extras.replaceUrl) {
              const s = {
                ...r.extras.state,
                ...this.generateNgRouterState(r.id, this.browserPageId),
              };
              this.location.replaceState(o, "", s);
            } else {
              const i = {
                ...r.extras.state,
                ...this.generateNgRouterState(r.id, r.targetPageId),
              };
              this.location.go(o, "", i);
            }
          }
          restoreHistory(n, r = !1) {
            if ("computed" === this.canceledNavigationResolution) {
              const i =
                this.currentPageId - (this.browserPageId ?? this.currentPageId);
              0 !== i
                ? this.location.historyGo(i)
                : this.currentUrlTree ===
                    this.getCurrentNavigation()?.finalUrl &&
                  0 === i &&
                  (this.resetState(n),
                  (this.browserUrlTree = n.currentUrlTree),
                  this.resetUrlToCurrentUrlTree());
            } else
              "replace" === this.canceledNavigationResolution &&
                (r && this.resetState(n), this.resetUrlToCurrentUrlTree());
          }
          resetState(n) {
            (this.routerState = n.currentRouterState),
              (this.currentUrlTree = n.currentUrlTree),
              (this.rawUrlTree = this.urlHandlingStrategy.merge(
                this.currentUrlTree,
                n.rawUrl
              ));
          }
          resetUrlToCurrentUrlTree() {
            this.location.replaceState(
              this.urlSerializer.serialize(this.rawUrlTree),
              "",
              this.generateNgRouterState(
                this.lastSuccessfulId,
                this.currentPageId
              )
            );
          }
          generateNgRouterState(n, r) {
            return "computed" === this.canceledNavigationResolution
              ? { navigationId: n, ɵrouterPageId: r }
              : { navigationId: n };
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)();
          }),
          (e.ɵprov = P({ token: e, factory: e.ɵfac, providedIn: "root" })),
          e
        );
      })();
      class fD {}
      let WP = (() => {
        class e {
          constructor(n, r, o, i, s) {
            (this.router = n),
              (this.injector = o),
              (this.preloadingStrategy = i),
              (this.loader = s);
          }
          setUpPreloading() {
            this.subscription = this.router.events
              .pipe(
                mn((n) => n instanceof zn),
                Bn(() => this.preload())
              )
              .subscribe(() => {});
          }
          preload() {
            return this.processRoutes(this.injector, this.router.config);
          }
          ngOnDestroy() {
            this.subscription && this.subscription.unsubscribe();
          }
          processRoutes(n, r) {
            const o = [];
            for (const i of r) {
              i.providers &&
                !i._injector &&
                (i._injector = ls(i.providers, n, `Route: ${i.path}`));
              const s = i._injector ?? n,
                a = i._loadedInjector ?? s;
              ((i.loadChildren && !i._loadedRoutes && void 0 === i.canLoad) ||
                (i.loadComponent && !i._loadedComponent)) &&
                o.push(this.preloadConfig(s, i)),
                (i.children || i._loadedRoutes) &&
                  o.push(this.processRoutes(a, i.children ?? i._loadedRoutes));
            }
            return De(o).pipe(Wn());
          }
          preloadConfig(n, r) {
            return this.preloadingStrategy.preload(r, () => {
              let o;
              o =
                r.loadChildren && void 0 === r.canLoad
                  ? this.loader.loadChildren(n, r)
                  : T(null);
              const i = o.pipe(
                be((s) =>
                  null === s
                    ? T(void 0)
                    : ((r._loadedRoutes = s.routes),
                      (r._loadedInjector = s.injector),
                      this.processRoutes(s.injector ?? n, s.routes))
                )
              );
              return r.loadComponent && !r._loadedComponent
                ? De([i, this.loader.loadComponent(r)]).pipe(Wn())
                : i;
            });
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(x(He), x(Hm), x(Qt), x(fD), x(Ql));
          }),
          (e.ɵprov = P({ token: e, factory: e.ɵfac, providedIn: "root" })),
          e
        );
      })();
      const Xl = new N("");
      let hD = (() => {
        class e {
          constructor(n, r, o, i, s = {}) {
            (this.urlSerializer = n),
              (this.transitions = r),
              (this.viewportScroller = o),
              (this.zone = i),
              (this.options = s),
              (this.lastId = 0),
              (this.lastSource = "imperative"),
              (this.restoredId = 0),
              (this.store = {}),
              (s.scrollPositionRestoration =
                s.scrollPositionRestoration || "disabled"),
              (s.anchorScrolling = s.anchorScrolling || "disabled");
          }
          init() {
            "disabled" !== this.options.scrollPositionRestoration &&
              this.viewportScroller.setHistoryScrollRestoration("manual"),
              (this.routerEventsSubscription = this.createScrollEvents()),
              (this.scrollEventsSubscription = this.consumeScrollEvents());
          }
          createScrollEvents() {
            return this.transitions.events.subscribe((n) => {
              n instanceof Nl
                ? ((this.store[this.lastId] =
                    this.viewportScroller.getScrollPosition()),
                  (this.lastSource = n.navigationTrigger),
                  (this.restoredId = n.restoredState
                    ? n.restoredState.navigationId
                    : 0))
                : n instanceof zn &&
                  ((this.lastId = n.id),
                  this.scheduleScrollEvent(
                    n,
                    this.urlSerializer.parse(n.urlAfterRedirects).fragment
                  ));
            });
          }
          consumeScrollEvents() {
            return this.transitions.events.subscribe((n) => {
              n instanceof Fv &&
                (n.position
                  ? "top" === this.options.scrollPositionRestoration
                    ? this.viewportScroller.scrollToPosition([0, 0])
                    : "enabled" === this.options.scrollPositionRestoration &&
                      this.viewportScroller.scrollToPosition(n.position)
                  : n.anchor && "enabled" === this.options.anchorScrolling
                  ? this.viewportScroller.scrollToAnchor(n.anchor)
                  : "disabled" !== this.options.scrollPositionRestoration &&
                    this.viewportScroller.scrollToPosition([0, 0]));
            });
          }
          scheduleScrollEvent(n, r) {
            this.zone.runOutsideAngular(() => {
              setTimeout(() => {
                this.zone.run(() => {
                  this.transitions.events.next(
                    new Fv(
                      n,
                      "popstate" === this.lastSource
                        ? this.store[this.restoredId]
                        : null,
                      r
                    )
                  );
                });
              }, 0);
            });
          }
          ngOnDestroy() {
            this.routerEventsSubscription?.unsubscribe(),
              this.scrollEventsSubscription?.unsubscribe();
          }
        }
        return (
          (e.ɵfac = function (n) {
            !(function Jh() {
              throw new Error("invalid");
            })();
          }),
          (e.ɵprov = P({ token: e, factory: e.ɵfac })),
          e
        );
      })();
      var ot = (() => (
        ((ot = ot || {})[(ot.COMPLETE = 0)] = "COMPLETE"),
        (ot[(ot.FAILED = 1)] = "FAILED"),
        (ot[(ot.REDIRECTING = 2)] = "REDIRECTING"),
        ot
      ))();
      const Ur = !1;
      function Cn(e, t) {
        return { ɵkind: e, ɵproviders: t };
      }
      const Jl = new N("", { providedIn: "root", factory: () => !1 });
      function gD() {
        const e = H(Kt);
        return (t) => {
          const n = e.get(ys);
          if (t !== n.components[0]) return;
          const r = e.get(He),
            o = e.get(mD);
          1 === e.get(ed) && r.initialNavigation(),
            e.get(yD, null, R.Optional)?.setUpPreloading(),
            e.get(Xl, null, R.Optional)?.init(),
            r.resetRootComponentType(n.componentTypes[0]),
            o.closed || (o.next(), o.complete(), o.unsubscribe());
        };
      }
      const mD = new N(Ur ? "bootstrap done indicator" : "", {
          factory: () => new Vt(),
        }),
        ed = new N(Ur ? "initial navigation" : "", {
          providedIn: "root",
          factory: () => 1,
        });
      function KP() {
        let e = [];
        return (
          (e = Ur
            ? [
                {
                  provide: Bi,
                  multi: !0,
                  useFactory: () => {
                    const t = H(He);
                    return () =>
                      t.events.subscribe((n) => {
                        console.group?.(`Router Event: ${n.constructor.name}`),
                          console.log(
                            (function Ex(e) {
                              if (!("type" in e))
                                return `Unknown Router Event: ${e.constructor.name}`;
                              switch (e.type) {
                                case 14:
                                  return `ActivationEnd(path: '${
                                    e.snapshot.routeConfig?.path || ""
                                  }')`;
                                case 13:
                                  return `ActivationStart(path: '${
                                    e.snapshot.routeConfig?.path || ""
                                  }')`;
                                case 12:
                                  return `ChildActivationEnd(path: '${
                                    e.snapshot.routeConfig?.path || ""
                                  }')`;
                                case 11:
                                  return `ChildActivationStart(path: '${
                                    e.snapshot.routeConfig?.path || ""
                                  }')`;
                                case 8:
                                  return `GuardsCheckEnd(id: ${e.id}, url: '${e.url}', urlAfterRedirects: '${e.urlAfterRedirects}', state: ${e.state}, shouldActivate: ${e.shouldActivate})`;
                                case 7:
                                  return `GuardsCheckStart(id: ${e.id}, url: '${e.url}', urlAfterRedirects: '${e.urlAfterRedirects}', state: ${e.state})`;
                                case 2:
                                  return `NavigationCancel(id: ${e.id}, url: '${e.url}')`;
                                case 16:
                                  return `NavigationSkipped(id: ${e.id}, url: '${e.url}')`;
                                case 1:
                                  return `NavigationEnd(id: ${e.id}, url: '${e.url}', urlAfterRedirects: '${e.urlAfterRedirects}')`;
                                case 3:
                                  return `NavigationError(id: ${e.id}, url: '${e.url}', error: ${e.error})`;
                                case 0:
                                  return `NavigationStart(id: ${e.id}, url: '${e.url}')`;
                                case 6:
                                  return `ResolveEnd(id: ${e.id}, url: '${e.url}', urlAfterRedirects: '${e.urlAfterRedirects}', state: ${e.state})`;
                                case 5:
                                  return `ResolveStart(id: ${e.id}, url: '${e.url}', urlAfterRedirects: '${e.urlAfterRedirects}', state: ${e.state})`;
                                case 10:
                                  return `RouteConfigLoadEnd(path: ${e.route.path})`;
                                case 9:
                                  return `RouteConfigLoadStart(path: ${e.route.path})`;
                                case 4:
                                  return `RoutesRecognized(id: ${e.id}, url: '${e.url}', urlAfterRedirects: '${e.urlAfterRedirects}', state: ${e.state})`;
                                case 15:
                                  return `Scroll(anchor: '${
                                    e.anchor
                                  }', position: '${
                                    e.position
                                      ? `${e.position[0]}, ${e.position[1]}`
                                      : null
                                  }')`;
                              }
                            })(n)
                          ),
                          console.log(n),
                          console.groupEnd?.();
                      });
                  },
                },
              ]
            : []),
          Cn(1, e)
        );
      }
      const yD = new N(Ur ? "router preloader" : "");
      function XP(e) {
        return Cn(0, [
          { provide: yD, useExisting: WP },
          { provide: fD, useExisting: e },
        ]);
      }
      const ti = !1,
        vD = new N(
          ti ? "router duplicate forRoot guard" : "ROUTER_FORROOT_GUARD"
        ),
        JP = [
          Kc,
          { provide: Ho, useClass: Ml },
          He,
          Qo,
          {
            provide: Gn,
            useFactory: function pD(e) {
              return e.routerState.root;
            },
            deps: [He],
          },
          Ql,
          ti ? { provide: Jl, useValue: !0 } : [],
        ];
      function eN() {
        return new Km("Router", He);
      }
      let DD = (() => {
        class e {
          constructor(n) {}
          static forRoot(n, r) {
            return {
              ngModule: e,
              providers: [
                JP,
                ti && r?.enableTracing ? KP().ɵproviders : [],
                { provide: Br, multi: !0, useValue: n },
                {
                  provide: vD,
                  useFactory: oN,
                  deps: [[He, new uo(), new co()]],
                },
                { provide: ra, useValue: r || {} },
                r?.useHash
                  ? { provide: Vn, useClass: KM }
                  : { provide: Vn, useClass: wy },
                {
                  provide: Xl,
                  useFactory: () => {
                    const e = H(vA),
                      t = H(de),
                      n = H(ra),
                      r = H(na),
                      o = H(Ho);
                    return (
                      n.scrollOffset && e.setOffset(n.scrollOffset),
                      new hD(o, r, e, t, n)
                    );
                  },
                },
                r?.preloadingStrategy
                  ? XP(r.preloadingStrategy).ɵproviders
                  : [],
                { provide: Km, multi: !0, useFactory: eN },
                r?.initialNavigation ? iN(r) : [],
                [
                  { provide: wD, useFactory: gD },
                  { provide: Ym, multi: !0, useExisting: wD },
                ],
              ],
            };
          }
          static forChild(n) {
            return {
              ngModule: e,
              providers: [{ provide: Br, multi: !0, useValue: n }],
            };
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(x(vD, 8));
          }),
          (e.ɵmod = bn({ type: e })),
          (e.ɵinj = un({ imports: [Ul] })),
          e
        );
      })();
      function oN(e) {
        if (ti && e)
          throw new w(
            4007,
            "The Router was provided more than once. This can happen if 'forRoot' is used outside of the root injector. Lazy loaded modules should use RouterModule.forChild() instead."
          );
        return "guarded";
      }
      function iN(e) {
        return [
          "disabled" === e.initialNavigation
            ? Cn(3, [
                {
                  provide: ps,
                  multi: !0,
                  useFactory: () => {
                    const t = H(He);
                    return () => {
                      t.setUpLocationChangeListener();
                    };
                  },
                },
                { provide: ed, useValue: 2 },
              ]).ɵproviders
            : [],
          "enabledBlocking" === e.initialNavigation
            ? Cn(2, [
                { provide: ed, useValue: 0 },
                {
                  provide: ps,
                  multi: !0,
                  deps: [Kt],
                  useFactory: (t) => {
                    const n = t.get(QM, Promise.resolve());
                    return () =>
                      n.then(
                        () =>
                          new Promise((r) => {
                            const o = t.get(He),
                              i = t.get(mD);
                            (function qP(e, t) {
                              e.events
                                .pipe(
                                  mn(
                                    (n) =>
                                      n instanceof zn ||
                                      n instanceof Gs ||
                                      n instanceof Ol ||
                                      n instanceof Ws
                                  ),
                                  G((n) =>
                                    n instanceof zn || n instanceof Ws
                                      ? ot.COMPLETE
                                      : n instanceof Gs &&
                                        (0 === n.code || 1 === n.code)
                                      ? ot.REDIRECTING
                                      : ot.FAILED
                                  ),
                                  mn((n) => n !== ot.REDIRECTING),
                                  Nr(1)
                                )
                                .subscribe(() => {
                                  t();
                                });
                            })(o, () => {
                              r(!0);
                            }),
                              (t.get(na).afterPreactivation = () => (
                                r(!0), i.closed ? T(void 0) : i
                              )),
                              o.initialNavigation();
                          })
                      );
                  },
                },
              ]).ɵproviders
            : [],
        ];
      }
      const wD = new N(ti ? "Router Initializer" : "");
      class ni {
        constructor(t, n, r, o) {
          (this.moves = t),
            (this.misses = n),
            (this.roundsPlayed = r),
            (this.accuracy = o);
        }
      }
      let CD = (() => {
        class e {
          constructor() {
            this.data = {
              "Card 6": new ni(0, 0, 0, 0),
              "Card 12": new ni(0, 0, 0, 0),
            };
          }
          getData() {
            return this.data;
          }
          setData(n, r) {
            this.data[r] = n;
          }
          static #e = (this.ɵfac = function (r) {
            return new (r || e)();
          });
          static #t = (this.ɵprov = P({
            token: e,
            factory: e.ɵfac,
            providedIn: "root",
          }));
        }
        return e;
      })();
      function aN(e, t) {
        if (1 & e) {
          const n = oc();
          ie(0, "section", 2)(1, "h3"),
            Te(2),
            le(),
            ie(3, "p"),
            Te(4, " Rounds Played "),
            ie(5, "b"),
            Te(6),
            le()(),
            ie(7, "button", 3),
            fn("click", function () {
              const i = xa(n).$implicit;
              return Pa(rs().navigate(i));
            }),
            Te(8, "Go to Page"),
            le()();
        }
        if (2 & e) {
          const n = t.$implicit,
            r = rs();
          Qe(2), kt(n), Qe(4), kt(r.cards[n].roundsPlayed);
        }
      }
      let _D = (() => {
        class e {
          constructor(n) {
            (this.route = n),
              (this.title = "Home Page"),
              (this.service = H(CD));
          }
          ngOnInit() {
            (this.cards = this.service.getData()),
              (this.cardsType = ["Card 6", "Card 12"]);
          }
          navigate(n) {
            this.route.navigate(["/card"], {
              queryParams: { card: "Card 6" === n ? 6 : 12 },
            });
          }
          static #e = (this.ɵfac = function (r) {
            return new (r || e)(I(He));
          });
          static #t = (this.ɵcmp = Kr({
            type: e,
            selectors: [["app-home"]],
            decls: 4,
            vars: 2,
            consts: [
              [1, "card-section"],
              ["class", "card", 4, "ngFor", "ngForOf"],
              [1, "card"],
              ["type", "button", 3, "click"],
            ],
            template: function (r, o) {
              1 & r &&
                (ie(0, "h1"),
                Te(1),
                le(),
                ie(2, "section", 0),
                ec(3, aN, 9, 2, "section", 1),
                le()),
                2 & r &&
                  (Qe(1), kt(o.title), Qe(2), Fn("ngForOf", o.cardsType));
            },
            dependencies: [ul],
            styles: [
              "*[_ngcontent-%COMP%]{box-sizing:border-box;margin:0;padding:0}.image-card[_ngcontent-%COMP%]{margin-top:10px;width:100px;height:100px;border-radius:10px;gap:5px;display:flex;align-items:center;justify-content:center;background-color:#fff}.image-card[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{border-radius:10px;width:100px}.box-found[_ngcontent-%COMP%]{background-color:#613434;width:100%;height:100%}h1[_ngcontent-%COMP%]{font-size:30px;text-transform:uppercase;text-align:center;margin-top:40px;font-style:italic;color:#86c6ff}.card-section[_ngcontent-%COMP%]{margin:100px auto;display:flex;flex-wrap:wrap;justify-content:space-evenly;width:700px}.card-section[_ngcontent-%COMP%]   .card[_ngcontent-%COMP%]{border-radius:10px;background-color:#00ffff63;color:#fff;display:flex;flex-wrap:wrap;justify-content:space-evenly;width:225px;padding:10px}.card-section[_ngcontent-%COMP%]   .card[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%]{font-size:24px;padding:5px}.card-section[_ngcontent-%COMP%]   .card[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{font-size:20px;padding:5px}.card-section[_ngcontent-%COMP%]   .card[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]{text-transform:uppercase;background-color:#dbbf94;margin-top:10px;padding:5px}.card-section[_ngcontent-%COMP%]   .card[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]:hover{background-color:#ffdead}",
            ],
          }));
        }
        return e;
      })();
      function ED(e, t, n, r, o, i, s) {
        try {
          var a = e[i](s),
            u = a.value;
        } catch (c) {
          return void n(c);
        }
        a.done ? t(u) : Promise.resolve(u).then(r, o);
      }
      class S {
        constructor(t, n) {
          (this.path = n), (this.id = t);
        }
      }
      function cN(e, t) {
        if (1 & e) {
          const n = oc();
          ie(0, "section", 7),
            fn("click", function () {
              const i = xa(n).$implicit;
              return Pa(rs().onClick(i));
            }),
            Ir(1, "div", 8),
            ie(2, "div", 9),
            Ir(3, "img", 10),
            le()();
        }
        if (2 & e) {
          const n = t.$implicit;
          Qe(1),
            Fn("hidden", !n.isFound),
            Qe(1),
            Fn("hidden", n.isFound),
            Qe(1),
            ic("src", n.path, Su),
            Fn("hidden", !n.isVisible);
        }
      }
      let SD = (() => {
        class e {
          constructor(n, r) {
            (this.route = n),
              (this.router = r),
              (this.service = H(CD)),
              (this.cards = {
                "Card 6": [
                  new S(1, "assets/img/game1.png"),
                  new S(2, "assets/img/game1.png"),
                  new S(3, "assets/img/game2.jpg"),
                  new S(4, "assets/img/game2.jpg"),
                  new S(5, "assets/img/game3.png"),
                  new S(6, "assets/img/game3.png"),
                ],
                "Card 12": [
                  new S(1, "assets/img/game1.png"),
                  new S(2, "assets/img/game1.png"),
                  new S(3, "assets/img/game2.jpg"),
                  new S(4, "assets/img/game2.jpg"),
                  new S(5, "assets/img/game3.png"),
                  new S(6, "assets/img/game3.png"),
                  new S(7, "assets/img/game4.jpg"),
                  new S(8, "assets/img/game4.jpg"),
                  new S(9, "assets/img/game5.jpg"),
                  new S(10, "assets/img/game5.jpg"),
                  new S(11, "assets/img/game6.jpg"),
                  new S(12, "assets/img/game6.jpg"),
                ],
              }),
              (this.foundCount = 0),
              (this.acc1 = 0),
              (this.openBox = []),
              (this.shuffle = (o) => {
                for (let i = o.length - 1; i > 0; i--) {
                  const s = Math.floor(Math.random() * (i + 1));
                  [o[i], o[s]] = [o[s], o[i]];
                }
                return o;
              });
          }
          ngOnInit() {
            this.router.queryParams.subscribe((o) => {
              this.cardType = o.card;
            }),
              (this.title =
                6 == this.cardType
                  ? "6 Cards Memory Game"
                  : "12 Cards Memory Game"),
              (this.cardName = 6 == this.cardType ? "Card 6" : "Card 12"),
              (this.box = this.cards[this.cardName]),
              this.shuffle(this.box),
              (this.cardStat = this.service.getData()[this.cardName]);
            let n = this.cardStat.roundsPlayed;
            0 !== n && (this.acc1 = Math.round(this.cardStat.accuracy / n));
          }
          ngOnDestroy() {
            if (0 != this.cardStat.moves) {
              let n = this.cardStat.roundsPlayed + 1,
                r = this.cardStat.accuracy;
              this.foundCount == Math.round(this.cardType / 2) && (r += 100),
                (this.acc1 = Math.round(r / n)),
                this.service.setData(new ni(0, 0, n, r), this.cardName);
            }
          }
          ngAfterViewInit() {
            const n = document.getElementById("game-container");
            (n.style.width = 6 == this.cardType ? "400px" : "500px"),
              (n.style.margin = 6 == this.cardType ? "50px auto" : "0px auto");
          }
          onRestart() {
            if (0 != this.foundCount) {
              let n = this.cardStat.roundsPlayed + 1,
                r = this.cardStat.accuracy;
              this.foundCount == Math.round(this.cardType / 2) && (r += 100),
                (this.acc1 = Math.round(r / n)),
                this.service.setData(new ni(0, 0, n, r), this.cardName),
                (this.box =
                  6 == this.cardType
                    ? [
                        new S(1, "assets/img/game1.png"),
                        new S(2, "assets/img/game1.png"),
                        new S(3, "assets/img/game2.jpg"),
                        new S(4, "assets/img/game2.jpg"),
                        new S(5, "assets/img/game3.png"),
                        new S(6, "assets/img/game3.png"),
                      ]
                    : [
                        new S(1, "assets/img/game1.png"),
                        new S(2, "assets/img/game1.png"),
                        new S(3, "assets/img/game2.jpg"),
                        new S(4, "assets/img/game2.jpg"),
                        new S(5, "assets/img/game3.png"),
                        new S(6, "assets/img/game3.png"),
                        new S(7, "assets/img/game4.jpg"),
                        new S(8, "assets/img/game4.jpg"),
                        new S(9, "assets/img/game5.jpg"),
                        new S(10, "assets/img/game5.jpg"),
                        new S(11, "assets/img/game6.jpg"),
                        new S(12, "assets/img/game6.jpg"),
                      ]),
                (this.cards[this.cardName] = this.box),
                this.shuffle(this.box),
                (this.openBox = []),
                (this.foundCount = 0),
                (this.cardStat = this.service.getData()[this.cardName]),
                console.log(this.box);
            } else
              this.service.setData(
                new ni(
                  0,
                  0,
                  this.cardStat.roundsPlayed,
                  this.cardStat.accuracy
                ),
                this.cardName
              ),
                (this.box =
                  6 == this.cardType
                    ? [
                        new S(1, "assets/img/game1.png"),
                        new S(2, "assets/img/game1.png"),
                        new S(3, "assets/img/game2.jpg"),
                        new S(4, "assets/img/game2.jpg"),
                        new S(5, "assets/img/game3.png"),
                        new S(6, "assets/img/game3.png"),
                      ]
                    : [
                        new S(1, "assets/img/game1.png"),
                        new S(2, "assets/img/game1.png"),
                        new S(3, "assets/img/game2.jpg"),
                        new S(4, "assets/img/game2.jpg"),
                        new S(5, "assets/img/game3.png"),
                        new S(6, "assets/img/game3.png"),
                        new S(7, "assets/img/game4.jpg"),
                        new S(8, "assets/img/game4.jpg"),
                        new S(9, "assets/img/game5.jpg"),
                        new S(10, "assets/img/game5.jpg"),
                        new S(11, "assets/img/game6.jpg"),
                        new S(12, "assets/img/game6.jpg"),
                      ]),
                (this.cards[this.cardName] = this.box),
                this.shuffle(this.box),
                (this.openBox = []),
                (this.cardStat = this.service.getData()[this.cardName]);
          }
          onClick(n) {
            null != n &&
              2 != this.openBox.length &&
              (this.box.filter((r) => {
                r.id === n.id && (n.isVisible = !0);
              }),
              this.openBox.push(n));
          }
          navigate() {
            this.route.navigate(["/"]);
          }
          onSection() {
            this.checkEquality();
          }
          checkEquality() {
            var n = this;
            return (function uN(e) {
              return function () {
                var t = this,
                  n = arguments;
                return new Promise(function (r, o) {
                  var i = e.apply(t, n);
                  function s(u) {
                    ED(i, r, o, s, a, "next", u);
                  }
                  function a(u) {
                    ED(i, r, o, s, a, "throw", u);
                  }
                  s(void 0);
                });
              };
            })(function* () {
              if (null != n.openBox && 2 === n.openBox.length) {
                yield (function lN(e) {
                  return new Promise((t) => setTimeout(t, e));
                })(2e3);
                let r = n.openBox[0],
                  o = n.openBox[1];
                if (r.path == o.path) {
                  if (
                    (n.box.filter((i) => {
                      i.path === r.path && (i.isFound = !0);
                    }),
                    n.foundCount++,
                    n.foundCount == Math.round(n.cardType / 2))
                  )
                    return void n.onRestart();
                } else n.cardStat.misses++;
                n.cardStat.moves++,
                  n.box.filter((i) => {
                    i.id === r.id && (i.isVisible = !1),
                      i.id === o.id && (i.isVisible = !1);
                  }),
                  (n.openBox = []);
              }
            })();
          }
          static #e = (this.ɵfac = function (r) {
            return new (r || e)(I(He), I(Gn));
          });
          static #t = (this.ɵcmp = Kr({
            type: e,
            selectors: [["app-card"]],
            decls: 31,
            vars: 6,
            consts: [
              [1, "container"],
              ["id", "game-container", 1, "game-container", 3, "click"],
              ["class", "image-card", 3, "click", 4, "ngFor", "ngForOf"],
              [1, "score-card"],
              [1, "card"],
              [1, "refresh"],
              ["type", "button", 3, "click"],
              [1, "image-card", 3, "click"],
              [1, "box-found", 3, "hidden"],
              [3, "hidden"],
              [3, "src", "hidden"],
            ],
            template: function (r, o) {
              1 & r &&
                (ie(0, "h1"),
                Te(1),
                le(),
                ie(2, "section", 0)(3, "section", 1),
                fn("click", function () {
                  return o.onSection();
                }),
                ec(4, cN, 4, 4, "section", 2),
                le(),
                ie(5, "section", 3)(6, "div", 4)(7, "p"),
                Te(8),
                le(),
                ie(9, "p"),
                Te(10, "No of Moves"),
                le()(),
                ie(11, "div", 4)(12, "p"),
                Te(13),
                le(),
                ie(14, "p"),
                Te(15, "No of Misses"),
                le()(),
                ie(16, "div", 4)(17, "p"),
                Te(18),
                le(),
                ie(19, "p"),
                Te(20, "Rounds Played"),
                le()(),
                ie(21, "div", 4)(22, "p"),
                Te(23),
                le(),
                ie(24, "p"),
                Te(25, "Accuracy"),
                le()()()(),
                ie(26, "section", 5)(27, "button", 6),
                fn("click", function () {
                  return o.onRestart();
                }),
                Te(28, "Restart"),
                le(),
                ie(29, "button", 6),
                fn("click", function () {
                  return o.navigate();
                }),
                Te(30, "Home"),
                le()()),
                2 & r &&
                  (Qe(1),
                  kt(o.title),
                  Qe(3),
                  Fn("ngForOf", o.box),
                  Qe(4),
                  kt(o.cardStat.moves),
                  Qe(5),
                  kt(o.cardStat.misses),
                  Qe(5),
                  kt(o.cardStat.roundsPlayed),
                  Qe(5),
                  kt(o.acc1));
            },
            dependencies: [ul],
            styles: [
              "*[_ngcontent-%COMP%]{box-sizing:border-box;margin:0;padding:0}.image-card[_ngcontent-%COMP%]{margin-top:10px;width:100px;height:100px;border-radius:10px;gap:5px;display:flex;align-items:center;justify-content:center;background-color:#fff}.image-card[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{border-radius:10px;width:100px}.box-found[_ngcontent-%COMP%]{background-color:#613434;width:100%;height:100%}h1[_ngcontent-%COMP%]{font-size:30px;text-transform:uppercase;text-align:center;margin-top:40px;font-style:italic;color:#86c6ff}.container[_ngcontent-%COMP%]{padding:10px;margin:50px auto;display:flex;flex-wrap:wrap;justify-content:space-between;width:100%}.container[_ngcontent-%COMP%]   .game-container[_ngcontent-%COMP%]{padding:10px;display:flex;flex-wrap:wrap;justify-content:space-between;width:400px}.container[_ngcontent-%COMP%]   .score-card[_ngcontent-%COMP%]{padding:10px;margin:50px auto;display:flex;flex-wrap:wrap;justify-content:space-around;width:400px}.container[_ngcontent-%COMP%]   .score-card[_ngcontent-%COMP%]   .card[_ngcontent-%COMP%]{margin-top:10px;text-align:center}.container[_ngcontent-%COMP%]   .score-card[_ngcontent-%COMP%]   .card[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{padding:10px;color:#fff;font-size:20px;text-transform:uppercase;font-family:Cambria,Cochin,Georgia,Times,Times New Roman,serif}.refresh[_ngcontent-%COMP%]{margin:0 auto;display:flex;flex-wrap:wrap;justify-content:space-evenly;width:100%}.refresh[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]{text-transform:uppercase;border-radius:10px;width:150px;height:30px;font-size:20px;margin-top:10px}",
            ],
          }));
        }
        return e;
      })();
      const dN = [
        { path: "home", component: _D },
        { path: "card/:card", component: SD },
        { path: "card", component: SD },
        { path: "**", component: _D },
      ];
      let fN = (() => {
          class e {
            static #e = (this.ɵfac = function (r) {
              return new (r || e)();
            });
            static #t = (this.ɵmod = bn({ type: e }));
            static #n = (this.ɵinj = un({ imports: [DD.forRoot(dN), DD] }));
          }
          return e;
        })(),
        hN = (() => {
          class e {
            static #e = (this.ɵfac = function (r) {
              return new (r || e)();
            });
            static #t = (this.ɵcmp = Kr({
              type: e,
              selectors: [["app-root"]],
              decls: 1,
              vars: 0,
              template: function (r, o) {
                1 & r && Ir(0, "router-outlet");
              },
              dependencies: [Bl],
              styles: [
                "*[_ngcontent-%COMP%]{box-sizing:border-box;margin:0;padding:0}.image-card[_ngcontent-%COMP%]{margin-top:10px;width:100px;height:100px;border-radius:10px;gap:5px;display:flex;align-items:center;justify-content:center;background-color:#fff}.image-card[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{border-radius:10px;width:100px}.box-found[_ngcontent-%COMP%]{background-color:#613434;width:100%;height:100%}h1[_ngcontent-%COMP%]{font-size:30px;text-transform:uppercase;text-align:center;margin-top:40px;font-style:italic;color:#86c6ff}",
              ],
            }));
          }
          return e;
        })(),
        pN = (() => {
          class e {
            static #e = (this.ɵfac = function (r) {
              return new (r || e)();
            });
            static #t = (this.ɵmod = bn({ type: e, bootstrap: [hN] }));
            static #n = (this.ɵinj = un({ imports: [mR, fN] }));
          }
          return e;
        })();
      gR()
        .bootstrapModule(pN)
        .catch((e) => console.error(e));
    },
  },
  (J) => {
    J((J.s = 81));
  },
]);
