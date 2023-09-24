import styled from 'styled-components'

import Card from './Card'
import Flex from './Flex'

import { ETH, USD } from '../utils'

const Button = styled.button({
    backgroundColor: '#f2f2f2',
    border: 'none',
    borderRadius: 5,
    cursor: 'pointer',
    height: 36,
    width: 200,
    margin: 12,
    padding: '10px',
    fontWeight: 700
}, ({ isSelected }) => ({
    backgroundColor: isSelected ? '#cecdcd' : '#f2f2f2'
}))

const Parameters = ({
    currency,
    setCurrency }) => {

    const isEthSelected = currency === ETH
    const isBtcSelected = currency === USD

    return <Card style={{
        backgroundColor: '#c994bc',
        borderRadius: '20px 20px 10px 10px',
    }}>
        <Flex style={{ justifyContent: 'center' }}>
            <h4>Priced in:</h4>
            <Button isSelected={isEthSelected} onClick={() => setCurrency(ETH)}>{ETH}</Button>
            <Button isSelected={isBtcSelected} onClick={() => setCurrency(USD)}>{USD}</Button>
        </Flex>
    </Card >
}

export default Parameters