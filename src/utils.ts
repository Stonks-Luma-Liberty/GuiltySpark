import { programs } from '@metaplex/js'
import axios from 'axios'
import { logger, metaplexConnection } from './settings'

const {
    metadata: { Metadata },
} = programs

export const getMetaData = async (tokenPubKey: string) => {
    try {
        const addr = await Metadata.getPDA(tokenPubKey)
        const resp = await Metadata.load(metaplexConnection, addr)
        const { data } = await axios.get(resp.data.data.uri)

        return data
    } catch (error) {
        logger.error(error)
    }
}
