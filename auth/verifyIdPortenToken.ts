import {
    createRemoteJWKSet,
    FlattenedJWSInput,
    JWSHeaderParameters,
    jwtVerify,
    JWTPayload,
} from 'jose';
import { GetKeyFunction } from 'jose/dist/types/types';
import getConfig from 'next/config';
import { Client, Issuer } from 'openid-client';

let _issuer: Issuer<Client>;
let _remoteJWKSet: GetKeyFunction<
    JWSHeaderParameters,
    FlattenedJWSInput
>;

async function validerToken(token: string | Uint8Array) {
    return jwtVerify(token, await jwks(), {
        issuer: (await issuer()).metadata.issuer,
    });
}

async function jwks() {
    if (typeof _remoteJWKSet === 'undefined') {
        const iss = await issuer();
        _remoteJWKSet = createRemoteJWKSet(
            new URL(<string>iss.metadata.jwks_uri),
        );
    }

    return _remoteJWKSet;
}

async function issuer() {
    if (typeof _issuer === 'undefined') {
        if (!process.env.IDPORTEN_WELL_KNOWN_URL)
            throw new Error(
                'Miljøvariabelen "IDPORTEN_WELL_KNOWN_URL" må være satt',
            );
        _issuer = await Issuer.discover(
            process.env.IDPORTEN_WELL_KNOWN_URL,
        );
    }
    return _issuer;
}

export const isExpired = (payload: JWTPayload) => {
    if (payload.exp * 1000 <= Date.now()) {
        return true;
    }
    return false;
};

export async function verifyIdportenAccessToken(token: string) {
    const verified = await validerToken(token);
    if (isExpired(verified.payload)) {
        throw new Error('IdPortenToken is expired');
    }

    if (
        verified.payload.client_id !== process.env.IDPORTEN_CLIENT_ID
    ) {
        throw new Error('client_id matcher ikke min client ID');
    }

    if (verified.payload.acr !== 'Level4') {
        throw new Error('Har ikke acr Level4');
    }
    return verified;
}
