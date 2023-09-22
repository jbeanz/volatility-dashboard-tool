import React from 'react'
import './table.css'

import Card from './Card'

const ImpactTable = () => {

    return (
        <Card style={{ backgroundColor: 'white', margin: 12 }}>
            <div className='table-container'>
                <div>MOST IMPACTFUL</div>
                <table>
                    <thead>
                        <tr>
                            <th>Twitter</th>
                            <th>% <span className="delta-symbol"></span></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Twitter Account 1</td>
                            <td>5%</td>
                        </tr>
                        <tr>
                            <td>Twitter Account 2</td>
                            <td>-2%</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </Card>
    )
}

export default ImpactTable