


var Timbaland;
(function () {
    Timbaland = function () {
        this.repeaters = [];
        Timbaland.installed = false;
        Timbaland.context = null;



        Timbaland.prototype.ambient = function (o, options) {
            if (!o) {
                o = new Timbaland.beat();
            }

            var r = new Timbaland.repeater(o, options.min_delay, options.max_delay);
            this.repeaters.push(r);

            if (Timbaland.installed) {
                r.run();
            }

            return r;
        };



        Timbaland.prototype.cancel = function (L) {
            if (L) {
                L.cancel();
                return;
            }

            for (var i = 0; i < this.repeaters.length; ++i) {
                this.repeaters[i].cancel();
            }
        };



        Timbaland.prototype.finishInstall = function (f) {
            var beat = new Timbaland.beat({ volume: 1e-5 });
            beat.play();
            Timbaland.installed = true;

            for (var i = 0; i < this.repeaters.length; ++i) {
                this.repeaters[i].run();
            }

            f && f();
        };



        Timbaland.prototype.fullTimba = function () {
            if (window.AudioContext || window.webkitAudioContext) {
                Timbaland.x = window.AudioContext ? new window.AudioContext() : new window.webkitAudioContext();
                return true;
            }
            else {
                return false;
            }
        };



        Timbaland.prototype.getAudioSource = function () {
            if (!Timbaland.loadEh()) {
                return false; // fallback?
            }

            var source = Timbaland.x.createBufferSource();
            source.buffer = Timbaland.buffer;
            return source;
        };



        Timbaland.prototype.loadEh = function () {
            if (Timbaland.buffer) {
                return true;
            }

            if (!this.fullTimba()) {
                alert('no timba :(');
                return false; // fallback?
            }

            var eh_base64 = 'SUQzAwAAAAAAIFRYWFgAAAAWAAAAU29mdHdhcmUATGF2ZjU1LjAuMTAw//uQZAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAAl' +
                'AAAizAAVFR8fHygoKDIyOjo6Q0NDTExWVlZeXl5mZmZvb3d3d319fYODi4uLkpKSmJienp6kpKSpqamvr7W1tbq6usHBxsbGy8vL0NDV1dXa2trf39/l5enp' +
                '6e3t7fHx9vb2+vr6//8AAABQTEFNRTMuMTAwBLkAAAAAAAAAADUgJAJdTQAB4AAAIszHT5CuAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA' +
                'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA' +
                'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA' +
                'AAAAAAAAAAAA//vAZAAAAeUGzj0kAAgAAA/woAABGenlMbnaEggAAD/DAAAAAGV+c1wjRo0ewQEAoDYrRzwTB8H8EAQDEoCHUCGXP/y4f4IHP//BAEAQd/y4' +
                'Pg+D4PggCAIAgAwfB8Hw+BAADQGQ6lb4uAwIAAAgwYRiQX2CwVpiGCIUmZoymGpAGDsdmxQTGLg3GAQYtzMEwOCBZKBAMBweMBgRAyAYMJAhjADJAGg4DTAN' +
                '9IkACXExIwBYaO0XOIkGygYEeDc0P1AadBq80HNDtB8xbOAoHDtiQFkcINj45YUAmZ4LhyFGigeIaZFYCg4G2yltCQYnC0YnlBCMFwlqjtzDb2V9I6mXRXCZ' +
                'NdZdOmQoYb761sSw4i86nS//////6rNf/7Kf//2rZZ0yzGj//6ep3sZsGNUxAFAEIF80kCGTCYwYSXMRLEIITqMDg44aPyALo1N0BwGljtKrpny4pggCAFXB' +
                'URdgPBgMDxOBmgI8GMIeFl4WFEQLxgT4x5qRQrsWDA3GbK5IkmmkRA06jN8zJp/1GROsOz9jIZgiqHUtz3/9SnWhSMEDVM6ZlEiDa7ABWYGYC6sYC6RGAZ0R' +
                'CwiI6nL+GAyOczAgoD05AYcMqqAyVtQbBFs9qSiiIgCwJAapAjPFL7MCYbArxvYY8LOYNwpmUIRqllIvGQPB7ZPVMn0SVf+O82UPG/sPQL6MtPqsU//5QEbY' +
                'uDACflpgJ+RC4F0Lo4x1LKRgACAAAE9sICBWJWCAYEx6JgO00x3IRd5CghBRgYTBxyzGxhGRR6SuFJAlixoDCLB5tyfQYiuMqMVKAXK3fe9+K15YJzNxeJ3C' +
                'aSgwxGTMB4vzM6f3H1D9MCFL4+F5N98fhyEc265MS//UbvJxcHYiZTEvj2JoxDxZZMAAIABAjvAgRNiGY4FhojggJIzgSzlKmFRWUCSEwRMOT6GhFDqR4QXF' +
                '8UMAA14yi/ZC4hSFtkBgYDdJXSr/+3Bk1YDz0T1M/3KACAAAD/DgAAEPHPU37mmpoAAAP8AAAASqP/VurzgXsZqYoF0RtGRBlpZmbpG25dPfuJYQh+M3+oKA' +
                'FUUjHSRSd9//Nj6JeJw9ETiTzJZjNbBgAAAAAAeYAADA4DC2mFA8YgAQYSB4DmnE6U/YwOWzEDwCEJsM+8RiuQQ6p24GF7DYRocClYcoqQpuAFJpmxJ0TFrR' +
                'YzA2INDu9GL6xZ/UTZ/xRJAulqieFyfOFxI0WtIiN+oOIvEQpP3UgE2GWSJH61E7SVf+orHMod4xgqY8SXJA+XpkOYrsSAAAHtBAAICMAA+aGQ4GExTEZBRh' +
                '6mHVwYFRiShTInRJrAzXDK2gEQeFBk3tcOwtaWyBbq5aSPgYrlVZ8b5irXO0w8Mks/YZFf+OL02iPQUnQEnK//twZOaA8889TPuaangAAA/wAAABDrjxNe5p' +
                'qegAAD/AAAAEDZicPGrqjjPfrExNSokXeo6PcKwABw2TNOg6qz//pkigfJ47Ck7j0Uoe6icifdMQAFAAAIeYAAwCEBAKYMFBALEBsqE4wNVjPIGQ6hBMYcmT' +
                'JplCACYFiXFpoCOYpd+wz41DZs924EGu4w2csst6zkPB+zddptnJHRXvXIOSVYYvPdVZMVxaH/m55yc9MvgUAsrZM7yMay0Hr/kaasohhDnPFdRsTJUyGNak' +
                'AAIAABTtAAKAGDwaoIAjOJJwKgMCAwwD2jIgYMAAYMARhAJDQilsDhAhU2ljhmZQ0lFERhQw/YMiZAEJISmCBkUB0SnjRRYqMxyE5fZEYTTNSIvRTy+UBzj/' +
                '3u20IxECLZSgYl/48H6iz//7cGT5BPRCPMv7mmp4AAAP8AAAARBQ9THuaangAAA/wAAABKmAGBfVJun//GR4wBbECPSEQJxIPBqSHlQayyqwIABgAACcfBAM' +
                'EBTCw6UjIqHIKxi9pzayJUoWBAaAA4yMKEWBFRoBBUDikgc4gCbur3CVUKxHASSNZ6wSfARm42QtpCqOy2Gi+YL20nYfa3jUQQP3hj3ucP1ul/mxKN9QdARB' +
                'h0is97sn+3Z0jo/G5rC6DBIl82OpJGozAcAACAAAPaBAKoKYQVRMRDJgZeYsRCMDO++wdrUzGQY1pltwhEg0Oh8wVBwfw6WUapkGknV6FxzvZWA6ATC4w3ZA' +
                'XSWBAAp3mAmTOFsLy2AdZKl8kGmiRolOuY/5KhSoX8LcVjEHgtvq/QbdzAchBlQzBaTA6P5sX45wcdX/+2Bk/gDz2z1Ne5qCeAAAD/AAAAEQ2PUz7mVRIAAA' +
                'P8AAAAShEAAAAAAHJAAAQWAxFdYxAGCgjpqAkRnX2oTWYRhMw0IjJ4lZM+gyQzGQQQeTaMpnM1IEy+CSJod+AYhQ2mgcTrJ7gEsPAtOMwgDQQB0z6umI1F7T' +
                '9SJ0FSJsNk1PQvnKJE4fPF83Nz25Jf1CoXUj3qPCBhLiJt1XqR1F5kFmA7R7g/jwNgqADiEEKIVpJGix8HQohP//////Z3/+jx7ZBAEADwAAEXgSHWeCpWML' +
                'BQwmGzBAsPlCQxQHgMABCKTOoAbZ0TBJvElK/bMDHh7MHA9sZhQmHCCeNDhiyihEnWn/+3Bk7QDz3jxN+3pq+gAAD/AAAAEPlO0z7emn6AAAP8AAAASTPGHm' +
                'QuW1w80Wp0bAFk5dmJfNQ46t+/E6aURPka749S4ZNW1/5kqe+gFeWGv30GfrmzFYOMLkOQkRYg5iSHCMIJE3OOoeB8yHz//////9X//pskAwAwAAB6QAFyhU' +
                'APqYlCosUUfSyx4l7gYFmAQOYJEI8etPuYIHJd1xS3JgMFLDA4HmAlEdMK6obiSUdLGDINiqmgjPM8KD3zhqasfl2HYhNouNaKDFHpKZq//CsLp0g+mIOLcq' +
                'b9lGuugyTnwb4gxqbKTEOJYFCRkCkyAzjwNlkkeoFAAAAAAF0gQBgBEAtEzAAkxMTBBgMoZ21sZqGgkBMIQQEjVY8DCIiApBPA4IS0RaAskGebErMF1sKQOC' +
                'oDcQ//twZPsE9Pw7ynuZbLgAAA/wAAABEnDzK+5lsuAAAD/AAAAEsBpiwFZpoNFhZtygaMLiSGx0cG/u3/8ef+CoJC4t+0YZ0v/6wOIVycW4egaBH55XIlhR' +
                'NOpEklAAAwAAuKwAEEwiCWxDo4YiGFQpICY6xqMXBIyYuckAckDEgaLDwK+kfBQUuFpRgYgB6MvW/EThy5HRAHq/yeExoLjHas7Ls9fzVq9Wl6G2oaebv///' +
                '4zJkL+RgZCiEWW/RjSx2bnRMCUAr59GRDgrCiLIkeAuXQY7FYAAzAAD46AAVpDAu8hhEDhAUAQTTkN52AO4CAEGDA0CROHbR7DhMWbsQCy3jsNVPEQBxO1uB' +
                'eZOiNG4PyLdRTPR4iES6zGFQSSoVx5//+oVWR/YYlBDN9GuvV54sHFC6OwA4Pv/7cGTsAPQaPUv7mWw4AAAP8AAAAQ609THtnZcgAAA/wAAABCVwVlpUmEQP' +
                'o1aTIABEAAC4jBAQEkIENjCwAqHkgEEgbmL0ImhJpfkUsx80mXqWiAioIq5iowBMaXcsdFGtZGuRQbQW860BBQs5UEoauXIrxabNWiixu5fLpJF0erf//s3/' +
                'MT31Vn6OtBajAe4xHRUXh4FwFiMovoj+PcxJYZJLpnv/////////pp0AAIQAReJAADSQ4FBwimIR45NMCwOM8IEMfQKFQRMAAjMDBCIgLmMPXA7rghYJJCst' +
                'TUyOA9ekvNEDMZwFnAvBKkTCFCCJj+F0DRGxqbm6RMLKYhIbK///Mmt/Pt9VkmfM8pFoyY8tFMPdHGaE8I/c8QImxkTAixTat0AAEQAx+BAACQCGCRGCAMD/' +
                '+2Bk+gDz0D1Me2pOqAAAD/AAAAEN4PUz7mlH4AAAP8AAAATgcFgQYNEZgASGicMbkGRgoVEAQBNhopA9JYYnDy8jDM2TOCKgDmo2LWZ6nuRNOgNCTtArJIc1' +
                'REopmm8YnqROmbkFAHogP////6v/v16RrW1FYKAeSSAnJaZqHwuHjps1KoAEEAANwAUCQ4TMdMBgIiCoGKRgwCm19SJ0AwMUAIWAEMyAsuyOiGyAIY/r6nF+' +
                'KEwYgjMVkd3LHdSPkhAyCN4n3YEGA7qayfytFX4rlYL6RKhvl0EnDU/////qX+v3zNqjrGOXC8FAC1iILgsjZFEd4JEOQkCi7//////9VYX/+2Bk9gDz/j1L' +
                '+7pp+AAAD/AAAAEPQPUt7HZFoAAAP8AAAAQwAAAAAcgAAAGAElgBwZAHMAAD4ZAZCgIwXB1MBpT05IfQgVGLgoZgAQ0Pmau9ApaeIroNKROAyQAGNBQZoVq/' +
                'J+EcwdkLgA32ClC2ohUNgpbrpDIAAAASwbBeC6ZFgwCtZPkgXBet///////16h9lVCtjAXGFioemURcRoQEkxjwJiNIclZ7/////+qpr19ll+NFtqFdUgATA' +
                'AA3ABQCcZiAAhuYALGDgplQ4xMzqDBTeXnVKWmBwa0qcTNgxAFGgaHPNeUHAQNR87/6gtmlvBpLNsXJZ9Idf+7fPnKaKyy3/+3Bk6YHzjT1Me5pqeAAAD/AA' +
                'AAEP2PMt7mmp4AAAP8AAAAT///yguGg8VEZh6IgRFBqE6v6wE6cRGegA4ACgAQJCoYgJjg4wjdhRgMg1aY2iyZYeYwWgCUplYsChC20XYrMwhgN7//8qEhCT' +
                'jhMqWHp3taTCe8x3hjyVqrwPW7//7v/4ROvVKanXaibBA/+2DFEIaH8AOgPwpurgC1LoGtcYNYgJAv4kczISFGadwWZvwlq15v5xorYO/v+V465N7kvs8mHz' +
                '5//+P/JUOT+a7//t+KCwmMNEjcaj4+FwKvWJcAFzACHAAAAfVnwyBiAGAoeVTAqhZjl+ZqIsrBoINEiEDajICqRU7ZQsLJeQO1SUoAZzsQ/GciUjnnbbMm/K' +
                '43D7WbstjMqg/nyl5aXf//+7/8lHDAxN//tgZPuA9LU9yXvckfgAAA/wAAABC3jzPe2A+qAAAD/AAAAEAR2Q4+4MSYCE///////b0/s/ciqoACnEyF4AYAfp' +
                'vWPJgDy4aotsZ4APiky4PKAICSrqEQNGwt0iUIwiZVi2nURBuape9rUDtfegq1atuTjvmfeznG7PM53ef/+ydRIYBDGucVHihVWZoEG1BEX4AgAiUGtEQImA' +
                'CxIa1jFdYxssSAWADgctUnWtxdzSGvaZZyC5AijF8Lfb9DSwPZrxGU/dlku1njvCd/smpt8//pT3UbGBoocw47hKLFnlwAGIAMQJx3y7BiYaBiAxsdQ1Aiod' +
                'oIAwUJg8oLhYmd143OXQ//tQZPKA8tM9T/tAXqgAAA/wAAABCiD1Q+wA+qAAAD/AAAAE/sPqWtmlA8IFzMPs1O0kMmEATmxyIwjcrjdXLPvwBFN0jlwdvP//' +
                '/oyhKcN7pNJS//////3VtUslX+jpWlqmGHmSAXMAF7gAAClpmcontxAxcoKZ6Jj6CQBQ4cOMNWc1J9Y7eOwQrIP2WNIDy6/PmuXuzBCNq1hiWc9Mh3vrg8Sy' +
                'bJo9/////W8KHHf//////wEr/jrtKnvDgAQYAa3ApZUyGWtZAQUwAyq1Nf/7UGTygPNaPMp7YF6oAAAP8AAAAQqA7zHtALqoAAA/wAAABGCU2iAJLeLNjCRp' +
                'e9fNZqIWAalVIpIa/zKMfVkiedLbx1hEZy1//9BbwqWcN3////ZRbFbP/////9Rb/7dfzKp4YABxADnwAAAmYATTEAKGQCBA09xlWOndGoCy5Idlaq9DLEx4' +
                'vVFRQ6mircSJDZs3LMJywwQaaC2dutx7CcEW7JNwKH2RjHRf////7xlLwyv9/////qizXE4t0Eq2jWpmw69KWlwAJIAR/gD/+2Bk6ILynjvL+2A+qgAAD/AA' +
                'AAEMqPMlzYD6oAAAP8AAAAQgDOkS3BgcXTBQY95pjeAzcVC1+jYFjKrFQDL2bWn3CmnVwFLBE6s+Us0JzFCWBnJ9PV6lZ5JviEqtp9opLP////+SLAngI///' +
                '////ezQUd+z+PYaqiYAEpwA3+ACAJ6TNDTwVGGFGJgqUL4hkKFVGVoHGh85yZBxElTFZZNsjFtIE73a+ONW6m/MfDNJ1hYrf5LLgx/////edZs///////t//' +
                '9cPAAMIAEAENPrKlF0iAoFX+M9R47xmNqnBSQkuzpn60EqkuBGGIbU4h0sCWNO/2/7erRCJDgYWLb9bj5jf/+1Bk/IHyvRpJ+3hKaAAAD/AAAAEKcN8n7YBa' +
                'oAAAP8AAAAT++2De5bf////Odn//////7LP2o4xq6ohgAqQAN7gAACPNLSoEYaiABR0UCDOeI14ECwEELAaIFmIVpyt0bKughXMAlKIgLGhE1P+keA+CAKjo' +
                '+Gpdxbfn97UZYm7////rX///////5aU/6tsxIAUIACvwHdbaEMjboZGEJUgaiKRAUChkSAABgXK25exsbQSAYE5JyodItSvL9+QLgJzUypGiAHE52ObonTEr' +
                '//tQZPyA8yIaSPuaSfgAAA/wAAABC4BrJ+3h6OAAAD/AAAAEf///+v7P//////S+//RtqpmQA1QAN/gBACGYKfVF4tSISJnpjkuE9eKBhICFlXqMkxIFHy3T' +
                'UCoFkSuu6pVxKnGuNW3Dz7msuRC/////zraougE0YAPfgZ0ha8yDAwpEyB6LmJsnqGnuNEPWUC50Cci/V0sBMMtvGYkZhMT3+2LOERQkqufSH8rYhGrTfjHJ' +
                'qlhwBFUAOfAAADeEGpGILmCCIzmSsjcsZAl/Tv/7UGTyAvJ5Gkr7WBpoAAAP8AAAAQpkaSfOZecgAAA/wAAABHkejp6mRgoK3H/U3WHIBAprkc/mGcci0eU+' +
                '1l9MuiKAUQS/MOqpb////9u5//////1XI/+1lfH5lokAGDAAX4FarDQjAmQRErdAo4m4HhmeoIS35hBvs0Ru7WWNIfl2iI9Q4pOCA8/b2koB4d5DJs1SBZn1' +
                'euy+Dmt////47X//////o9+rp9NVVCp4oBNCAEnwAIA5TyBDuLJDQoVoHFHAZi5HIBh1R8waO+v/+1Bk9oHypxpKe3lKSAAAD/AAAAEJ/Gkp7eFpIAAAP8AA' +
                'AAQxBxhYyqAw4yVH+xVDDK6oswT0kHruG//4w/////5Du///////xL//Ze0yAAqgBz8D8LaqpEzBgCfNBPJqTTc04Ca9jIkWZwrDLyIjKczrLV53vXPzZsST' +
                'IZGfVwtuzF3zOQbHrv///+gp2///////bT/ehW3j6giAAVYAKfgAAD/hpjD7KlbubWITRI8gAKApMSvU8EoXu9KDKykDH3AzNpnd73eWOVCHJB5H//swZPoB' +
                '8gQTy3t4YdgAAA/wAAABB/hhK+1k5+gAAD/AAAAE6QBhsO//JJwY////+3iv/////+uin/2uX0oaKACcwBH+AEAN6xQQHAIN4xk0Px5GmS+WwHDS2hUcVqjq' +
                'wAVTRpUXQ2jVjqH2gWIkioJHPA5fWHXO////4qU1AH///////MUHkEKFADP4AIAxINJl1gYCMTAzhWBx//tQZPWB8pwayftYOmgAAA/wAAABCkhpJ+1laSAA' +
                'AD/AAAAEgobkky7BII1l51pKjbZfIsY0nuvKkmNphInrAKPSr/9x4e////+Pdv///////1f+z1LDmhuwAq/AAAH7yT/Y0/LGhd4PfLQhZxkTgvxxDkHBdaOF' +
                '3nD2xtwr/iYgcoyFGhKIAe0qzK+rdfFTRZv////o63f/////enkbke3xTXZcCIBkpwA18AAAP+qlSqG1VHMDqZEwLJAOQHmNR0RhGmNBlRe6dZGTHaHzOP/7' +
                'QGT4gfJTGMp7WEnYAAAP8AAAAQmcZyntYYdgAAA/wAAABMH6yijAEwf6bWiQmzb////////////xev1/v1VA0AKxAAl+A/9w2XfRrnAvGNEiABaZBCy+UIwu' +
                'Ns0buvl6CqFHR+O7s42pmdfV9X7QGM8qgYJjIzv/Ns////+3t//////xe2qz6HeQBpZ0eQA3+AAANQSAZAYrUGqGkuscQErdb61eYCY5bIJS/MNvyRatm/j/' +
                '//tAZPWA8noZSftPNJgAAA/wAAABCOxPK+xlJaAAAD/AAAAE83MDqQALcHhT3/n5+x4t3////+j//////sX/+77xVTRSOkOAI9wP7EIgEmLrZIHRgZdBIzVX' +
                'IEZ7tsH0aEcjSlGUEtVfw/nq1z2eXKFZ4eLV/gKoj///////////6f1//Y7dmqA1qQBt+AGAN1J9aRZcRGQGIbRM9aaRYMGFwWHKAhyYlN2RiC6cvhFLcbGQ' +
                '8hH/+1Bk8wDyPRjKeLkw+AAAD/AAAAEJ6GMn7OEnYAAAP8AAAAQAmKGep3////qYG+xYkAJmAUnoAAAyxhplo4QzDaUcC8NJm5jAlp4CCopmk8T2kSy0pTSc' +
                'fjFqedqjpZfv4RiPGjIe/////9X//////UuG0/2yK966lXiQQJcBW+gAADVd6G4lrRUq3Q1cwIqIYIcB5LalmBoBzkuYg5G+QUrf3uiQsqcviYurAgTMSJV3' +
                '///////////9///+t4hESXEG+4GOVK2zXkhhQpec//tAZP2B8jsUSns4SdgAAA/wAAABCXRhJ+zgx+AAAD/AAAAEXamgMgFiJfPDTtwQIWKg8d8p5m1b90pq' +
                'EooeFgOkCxl/wx0z////////////63iiVKgAf7gBADnaXggADl38MDUO3UEEAQCFUGbrAKykjZVcYLQSUG7/9vSMlQcIwXM1f/D2f///9Svv//////+l6sCW' +
                'JVJ3qA2kGQAmGMVzEzSJ88YWFAEA2KW4RZYZoSiwkLX/+zBk/QHySRjJ+Flg+AAAD/AAAAEIeGEp7LyrYAAAP8AAAAROuVHDDvqr0HpKuaQQ1vqn3+AKaJAT' +
                'iCF/aAAAMrz9sOOsMXIcc8DSkZI8QDgKMNk9mQswkLavAjCE3At2/q+i1jrk/0pBS0dU/xbf////R9H////+v26dHsb7drETMAK1KLH3ACAFaheBZLXBGDeg' +
                'ZmBhSAC4JaL/+0Bk8oDx2BJL+y9KuAAAD/AAAAEJKE8n7GnkoAAAP8AAAARA+JSyStghqOJfLEW2WWieHnN3ZcjPB5/v/gJf////2rpYggaJEH4oAIA52GG3' +
                'GhhMLaAa9CUgWMDSI1RYni+8GmYyv2SG6GhYU/pijZZEszGxRaf+Gf////4pXUxP/////9BTvZ26trakreHAjlwBgAqzErIAmjjpy8yX0lTc9gYILR/d2XBf' +
                '63BJCseAppM/nf/7MGT5AfIkFUp7T2I4AAAP8AAAAQfwYSvsMFJgAAA/wAAABL6otHx2x//hf////RV85/////tX7nvLLH9fV5ytFWmQFJgQjjAAAD9t2T1L' +
                '5BEY8dHCyqUYKHCKz5abHNSNywZAoCd/TO9AK7DR//xAIkBeIRo4oAIA1hO2aly4gbwC1JhYA4ChE/yDZ6pQoOSSgQyp9bRDTA3II//7MGTzA/IGGEt7KRQo' +
                'AAAP8AAAAQa0YS3NMFJgAAA/wAAABP0/////W7///////1///rVqgFaaVY4AAQA3pVMGETLEYoLEWwrFIcoEIhsOitpWwt86GcCsVbgD4efUyQoOGOf////9' +
                'VNtav////////W8SgO8kkawNg2AQFwt8dyQutsZhibbUOHSETIn/3GHlfBn+EyA0wc/////7QGTzgPJTGMn7LxLYAAAP8AAAAQdkYy3tJFJgAAA/wAAABP//' +
                '///////9VP/3pXqgWbsRDjAAAC4JSvMAhfNwlaOlJeZkhtXHlX6lqIS+H8xecUHN9Fv1q0EBxAkAGfjmzUFFa7AAqosFXKc8mle0CvYQQwFicKVdRG///+3/' +
                '///////////716KFHpuboDWKSAAAANMILQJDmcMTzIVCEhqUSkQjEfKsJYxiYEnlWFRbiRKo//tAZPmC8k4YyftPEtgAAA/wAAABCJRhJcywTSAAAD/AAAAE' +
                'OJbFqg4RbpM5Skz+Mji6BhE1Nqd7OlfB0mUlzGJQ20mBdf//////////v0v8in3vtY77HEq7GMZFTK7Lh1BtInKXLAhM0RcgXMEOJsDkQC3kAsqDEwdo1cxK' +
                'BSWOULAseDf///9f+q5We2YtjZ6OQUrLtoVhDKYMCBqcSMtpuDCazwQcopaiVQ16620Scv86whv/+yBk+wDxdhhKewgrqAAAD/AAAAEHWEkr5uBj4AAAP8AA' +
                'AASwXrK42///////////////3tmXoMXD3ijrKwkVqLAAE00zo5JcQALAOZUI8VoktMzM0TAPxE+MTpVWmmgggh+gggg3kIQhP////+3//tr+/tr99fe9+v//' +
                '///1Slm1//swZPUD8fMRyvsRFAgAAA/wAAABBqwxKcTnAmAAAD/AAAAE3JLZjKgYqBUi2MN5KNJGlpuh1tiGujg+lAVHYQlSIVqIga3GKArV6pVknw4tUwCC' +
                'iT4lEQNHsGgaDlQNA1//////////////bed1hosDLhFLVUxBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//sgZPcB8UkMS/g5WGgAAA/w' +
                'AAABBpwxJ8xpiGAAAD/AAAAEVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV' +
                'VVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/7MGT3A/EhDExzAXqIAAAP8AAAAQhx5RqMAFfIAAA/wAAABFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV' +
                'VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/7' +
                'IGT/A/H0d0YiYBXyAAAP8AAAAQWwMSCA4eLAAAA/wAAABFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV' +
                'VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVX/+0Bk+AHzLHlESiI2cgAAD/AAAAEF9B8TIDzA4AAAP8AAAARVVVVVVVVVVVVVVVVVVVVV' +
                'VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV' +
                'VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVQ==';

            var eh_binary = window.atob(eh_base64);
            var eh_buffer = new Uint8Array(eh_binary.length);
            for (var i = 0; i < eh_binary.length; ++i) {
                eh_buffer[i] = eh_binary.charCodeAt(i);
            }

            Timbaland.x.decodeAudioData(eh_buffer.buffer, function (B) { Timbaland.buffer = B; });
            return true;
        };



        Timbaland.prototype.schedule = function (o, delay) {
            return this.ambient(o, { min_delay: delay, max_delay: delay });
        };



        // new Promise( function ( resolve, reject ) { setTimeout( function () { resolve( 'x', 500 ); } ); } );
        //  resolve => function to resolve
        //  e.g., promise.then( `resolve` )
        //  Promise( fn )
        //   fn => function to run
        //   e.g., new Promise( fn ).then( res )



        Timbaland.prototype.installListeners = function (events, fn) {
            const controller = new AbortController();
            const signal = controller.signal;
            const wrapped_fn = function () {
                fn();
                controller.abort();
                // for ( var i = 0; i < events.length; ++i )
                // {
                // 	window.removeEventListener( events[i], nf );
                // }
            };

            events.forEach((e) => { window.addEventListener(e, wrapped_fn, { signal: signal }); });

            // for ( var i = 0; i < events.length; ++i )
            // {
            // 	window.addEventListener( events[i], wrapped_fn );
            // }
        };



        Timbaland.prototype.installOnEvent = function (elt, evt, f) {
            var _this = this;
            elt.addEventListener(evt, function (e) {
                _this.finishInstall(function () { f && f(e); });
            });
        };



        // take a callback, and an error function?
        // on success, then run timbaland
        Timbaland.prototype.installWhenPossible = function (acc, rej) {
            if (!Timbaland.loadEh()) {
                return rej && rej();
            }

            var _this = this;
            this.installListeners(['click', 'keydown'], function () {
                _this.finishInstall(acc, rej);
            });
        };



        Timbaland.prototype.test = function () {

            let loop = new Timbaland.loop({ tempo: 100 });
            loop.addBeat();
            loop.addRest(2);
            loop.addBeat();
            loop.addRest(5 / 4);
            loop.addBeat({ detune: -200 });

            this.installWhenPossible();
            Timbaland.schedule(loop, 3000);
        };
    };



    Timbaland = new Timbaland();



    Timbaland.beat = function (o) {
        this.o_beat = null;



        this.detune = o && o.detune ? o.detune : 0;
        this.volume = o && o.volume ? o.volume : 1;



        Timbaland.beat.prototype.getBeat = function () {
            if (this.o_beat) {
                // return;
            }

            this.o_beat = Timbaland.getAudioSource();
            this.o_beat.detune.value = this.detune;

            var gain = Timbaland.x.createGain();
            this.o_beat.connect(gain);
            gain.gain.value = this.volume;
            gain.connect(Timbaland.x.destination);
        };



        Timbaland.beat.prototype.play = function (t) {
            this.getBeat();
            this.o_beat.start(t);

            return 0;
        };
    };



    Timbaland.loop = function (o) {
        this.loop_items = [];



        this.tempo = o && o.tempo ? o.tempo : 120;



        Timbaland.loop.prototype.addBeat = function (o) {
            this.addElement(new Timbaland.beat(o));
        };



        Timbaland.loop.prototype.addElement = function (o) {
            this.loop_items.push(o);
        };



        Timbaland.loop.prototype.addRest = function (d) {
            this.addElement(new Timbaland.rest(d));
        };



        Timbaland.loop.prototype.cancel = function () {
        };



        Timbaland.loop.prototype.play = function () {
            var t = Timbaland.x.currentTime + 0.05; // ff slightly into the future
            for (var i = 0; i < this.loop_items.length; ++i) {
                t += this.loop_items[i].play(t) * 60 / this.tempo;
            }
        };
    };



    Timbaland.repeater = function (loop, min, max) {
        this.loop = loop;
        this.min = min;
        this.max = max;

        this.timeout = null;
    };



    Timbaland.repeater.prototype.cancel = function () {
        if (!this.timeout) {
            return;
        }

        if (this.min == this.max) // hack.
        {
            window.clearInterval(this.timeout);
        }
        else {
            window.clearTimeout(this.timeout);
        }

        this.timeout = null;
    };



    Timbaland.repeater.prototype.run = function () {
        this.cancel();

        var _this = this;
        if (this.min == this.max) {
            this.timeout = window.setInterval(function () { _this.loop.play(); }, this.min);
        }
        else {
            this.timeout = window.setTimeout(function () {
                _this.loop.play();
                _this.timeout = null;
                _this.run();
            }, this.min + (this.max - this.min) * Math.random());
        }
    };



    Timbaland.rest = function (d) {
        this.duration = d;


        Timbaland.rest.prototype.play = function (t) {
            return this.duration;
        };
    };
})();







