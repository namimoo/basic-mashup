/*
 * Basic responsive mashup template
 * @owner Enter you name here (xxx)
 */
/*
 *    Fill in host and port for Qlik engine
 */
// var prefix = window.location.pathname.substr( 0, window.location.pathname.toLowerCase().lastIndexOf( "/extensions" ) + 1 );

// var config = {
// 	host: window.location.hostname,
// 	prefix: prefix,
// 	port: window.location.port,
// 	isSecure: window.location.protocol === "https:"
// };

// Engine do Qlik
const engine = {

    connectQCS: (config) => new Promise((resolve) => {
        const tenantUri = `https://${config.host}`;

        engine.request(
            config,
            tenantUri,
            '/api/v1/users/me'
        ).then((user) => {
            console.log(`Logged in, ${user.name}`);
            engine.loadCapSAAS(config).then(() => {
                window.requirejs.config({
                    webIntegrationId: config.webIntegrationId,
                    baseUrl: `${tenantUri}${config.prefix}resources`
                });

                window.requirejs(['js/qlik'], (qlik) => {
                    resolve(qlik);
                });
            });
        }, () => {
            console.log('Redirecting to Qlik Cloud...');
            const returnTo = encodeURIComponent(window.location.href);
            window.location.href = `${tenantUri}/login?returnto=${returnTo}&qlik-web-integration-id=${config.webIntegrationId}`;
        });
    }),

    connectQSE: (config) => new Promise((resolve) => {
        engine.loadCapabilityApis(config).then(() => {
            const protocol = config.isSecure ? 'https://' : 'http://';
            const port = config.port ? `:${config.port}` : '';
            window.requirejs.config({
                baseUrl: `${protocol}${config.host}${port}${config.prefix}resources`
            });
            window.requirejs(['js/qlik'], (qlik) => resolve(qlik));
        });
    }),

    request: (config, tenantUri, path, returnJson = true) => new Promise((resolve, reject) => {
        fetch(`${tenantUri}${path}`, {
            mode: 'cors',
            credentials: 'include',
            redirect: 'follow',
            headers: {
                'qlik-web-integration-id': config.webIntegrationId
            }
        }).then((res) => {
            if (res.status < 200 || res.status >= 400) reject(res);
            return returnJson ? resolve(res.json()) : resolve(res);
        }, (err) => { reject(err); });
    })
};

let config = {
	host: 'grupoitg-nordica.us.qlikcloud.com',
	prefix: '/',
	port: 443,
	isSecure: true,
	webIntegrationId: 'zQLeIH8-uf87QC9JyLRsdrdZpvhVlkli'
}

require.config( {
    baseUrl: ( config.isSecure ? "https://" : "http://" ) + config.host + (config.port ? ":" + config.port : "") + config.prefix + "resources",
    webIntegrationId: config.webIntegrationId
} );

  engine.connectQCS(config).then(qlik =>{
// require( ["js/qlik"], function ( qlik ) {
	qlik.on( "error", function ( error ) {
		$( '#popupText' ).append( error.message + "<br>" );
		$( '#popup' ).fadeIn( 1000 );
	} );
	$( "#closePopup" ).click( function () {
		$( '#popup' ).hide();
	} );

	//callbacks -- inserted here --
	//open apps -- inserted here --
	// var app = qlik.openApp('4aef20d3-a3a7-4e93-9e65-70f11b624521', config);
	// var app = qlik.openApp('Helpdesk Management.qvf', config);
	var app = qlik.openApp('999759c8-696c-4009-9546-0e658a9c6fdc', config);

	//get objects -- inserted here --
	app.getObject('QV03','JARjh');
	app.getObject('QV02','jTuCwkB');
	app.getObject('QV01','JsVPe');
	app.getObject('QV04','PAppmU', {noSelections:"true"});
	//create cubes and lists -- inserted here --

} );
