// Bing Mapsの初期化
let map;

function loadMapScenario() {
    map = new Microsoft.Maps.Map('#map', {});

    // 登録ボタンクリックイベント
    $('#registerButton').click(function() {
        const address = $('#address').val();
        const memo = $('#memo').val();

        // 住所から緯度経度を取得
        Microsoft.Maps.loadModule('Microsoft.Maps.Search', function () {
            const searchManager = new Microsoft.Maps.Search.SearchManager(map);
            const requestOptions = {
                where: address,
                callback: function (results) {
                    if (results && results.results && results.results.length > 0) {
                        const location = results.results[0].location;

                        // Firebaseに保存
                        db.collection("pins").add({
                            address: address,
                            memo: memo,
                            location: new firebase.firestore.GeoPoint(location.latitude, location.longitude)
                        });

                        // マップにピンを追加
                        const pin = new Microsoft.Maps.Pushpin(location);
                        map.entities.push(pin);

                        // ピンクリックでメモ表示
                        Microsoft.Maps.Events.addHandler(pin, 'click', function () {
                            alert(memo);
                        });
                    }
                }
            };
            searchManager.geocode(requestOptions);
        });
    });

    // 既存のピンをマップに表示
    // ... ここにFirebaseからピンを読み込んでマップに表示するコード ...
    db.collection("pins").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const location = new Microsoft.Maps.Location(data.location.latitude, data.location.longitude);
            
            // ピンを作成
            const pin = new Microsoft.Maps.Pushpin(location, { text: '📍' });
            map.entities.push(pin);

            // ピンクリックでメモ表示
            Microsoft.Maps.Events.addHandler(pin, 'click', function () {
                alert(data.memo);
            });
            // 入力内容のクリア
            $('#address').val('');
            $('#memo').val('');
        });
    });
}

// Firebaseの設定を初期化

const firebaseConfig = {
hogehoge
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
