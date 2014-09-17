Ext.define('POS.view.credit.ListPaymentController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.list-credit-payment',

    control: {
        '#': {
            selectionchange: function(sm, selected){
                var cancel      = this.lookupReference('cancel');

                cancel.setDisabled(selected.length !== 1);
            }
        }
    },
    
    cancel: function(){
        var record     = this.getView().getSelectionModel().getSelection()[0],
            params     = {
                id: record.get('id')
            };

        Ext.Msg.confirm(
            '<i class="fa fa-exclamation-triangle glyph"></i> Batalkan Penjualan <p>',
            'Apakah Anda yakin akan membatalkan Pembayaran Piutang ini?',
            function(btn){
                if (btn == 'yes'){
                    Ext.fn.App.setLoading(true);
                    var monitor = Ext.fn.WebSocket.monitor(
                        Ext.ws.Main.on('credit/cancelPayment', function(websocket, result){
                            clearTimeout(monitor);
                            Ext.fn.App.setLoading(false);
                            if (result.success) {
                                POS.app.getStore('CreditPayment').load();
                                POS.app.getStore('Credit').load();
                            }else{
                                Ext.fn.App.notification('Ups', result.errmsg);
                            }
                        }, this, {
                            single: true,
                            destroyable: true
                        })
                    );
                    Ext.ws.Main.send('credit/cancelPayment', params);
                }
            }
        );
    },
    
    search: function(){
        Ext.fn.App.window('search-credit-payment');
    },
    
    reset: function(){
        this.getView().getStore().search({});
    }
});
