import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import dataJSON from '../api/data.json';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

function createData(
  location,
  category,
  product,
  totalStock,
  percent,
  totalOrder,
  items
) {
  return {
    location,
    category,
    product,
    totalStock,
    percent,
    totalOrder,
    items,
  };
}

export default function BasicTable() {
  const classes = useStyles();
  const [proformaItem, setProformaItem] = useState([]);
  const [location, setLocation] = useState([]);
  const [proformaInfoId, setProformaInfoId] = useState([]);

  useEffect(() => {
    const parseData = JSON.parse(JSON.stringify(dataJSON));

    setProformaItem(parseData.proformaItem);
    setLocation(parseData.location);
    setProformaInfoId(parseData.proformaInfoId);
  }, []);

  const rows = proformaItem.map((item) => {
    const parseProductStock = JSON.parse(item.product_stock);
    const parseItems = JSON.parse(item.items);

    const locationStock = location.map((loc) => {
      return parseProductStock.filter((item) => Object.keys(item)[0] == loc.id);
    });

    const proformaItems = proformaInfoId.map((pro) => {
      return parseItems.filter((item) => Object.keys(item)[0] == pro);
    });

    const totalStock =
      locationStock[0][0][location[0].id] + locationStock[1][0][location[1].id];
    const percent = ((item.qty / totalStock) * 100).toFixed(2);

    return {
      id: item.product_id,
      [location[0].id]: locationStock[0][0][location[0].id],
      [location[1].id]: locationStock[1][0][location[1].id],
      categoryDescription: item.categoryDescription,
      productDescription: item.productDescription,
      totalStock,
      percent,
      qty: item.qty,
      [proformaInfoId[0]]:
        typeof proformaItems[0][0] === 'undefined'
          ? 0
          : proformaItems[0][0][proformaInfoId[0]],
      [proformaInfoId[1]]:
        typeof proformaItems[1][0] === 'undefined'
          ? 0
          : proformaItems[1][0][proformaInfoId[1]],
      [proformaInfoId[2]]:
        typeof proformaItems[2][0] === 'undefined'
          ? 0
          : proformaItems[2][0][proformaInfoId[2]],
    };
  });

  console.log(rows);
  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label='simple table'>
        <TableHead>
          <TableRow>
            {location.map((loc) => (
              <TableCell key={loc.id}>{loc.name}</TableCell>
            ))}
            <TableCell>Category</TableCell>
            <TableCell>Product</TableCell>
            <TableCell>Total Stock</TableCell>
            <TableCell>Percent %</TableCell>
            <TableCell>Total Order</TableCell>
            {proformaInfoId.map((name) => (
              <TableCell key={name}>{name}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row[location[0].id]}</TableCell>
              <TableCell>{row[location[1].id]}</TableCell>
              <TableCell>{row.categoryDescription}</TableCell>
              <TableCell>{row.productDescription}</TableCell>
              <TableCell>{row.totalStock}</TableCell>
              <TableCell>{row.percent} %</TableCell>
              <TableCell>{row.qty}</TableCell>
              <TableCell>{row[proformaInfoId[0]]}</TableCell>
              <TableCell>{row[proformaInfoId[1]]}</TableCell>
              <TableCell>{row[proformaInfoId[2]]}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
