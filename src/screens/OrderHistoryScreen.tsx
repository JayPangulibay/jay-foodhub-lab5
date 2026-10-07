import React from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { color, font, text } from '../theme';
import { Screen } from '../components/Screen';
import { PageHeader } from '../components/Chrome';
import { Button, confirmDestructive } from '../components/Controls';
import { Icon } from '../components/Icon';
import { useScale } from '../components/scale';
import { parseOrderItems } from '../services/db';
import { formatOrderStamp, MENU, STAGES } from '../data/menu';
import { useApp, useBack } from '../state/AppContext';

/**
 * Read-only receipt for one stored order: line items with their quantity and
 * unit price, the stage it is sitting at, and how to delete it.
 *
 * Reached from the Orders tab (`route.orderHistory`). The row is looked up by
 * id rather than passed through the route so the screen always renders what is
 * actually in SQLite — deleting the order elsewhere simply lands on "not found".
 */
export function OrderHistoryScreen({ orderId }: { orderId: number }) {
  const { state, dispatch } = useApp();
  const back = useBack();
  const { px } = useScale();

  const order = state.orders.find((o) => o.id === orderId);
  const items = order ? parseOrderItems(order.items) : [];
  // Pre-LABORATORY-6 rows carry no unit price; fall back to the paid total.
  const itemsTotal = items.every((i) => typeof i.price === 'number')
    ? items.reduce((sum, i) => sum + i.qty * (i.price ?? 0), 0)
    : order?.total ?? 0;

  const confirmDelete = () => {
    if (!order) return;
    confirmDestructive({
      title: `Delete order #JF-${order.id}?`,
      message: 'This removes it from your history and cannot be undone.',
      confirmLabel: 'Delete',
      onConfirm: () => {
        dispatch({ type: 'orderDeleted', id: order.id });
        back();
      },
    });
  };

  return (
    <Screen background={color.surface}>
      <PageHeader title={`Order #JF-${orderId}`} leading="arrow-left" onLeading={back} />

      {!order ? (
        <View style={styles.empty}>
          <Icon name="receipt" size={px(40)} color={color.brand} />
          <Text style={[styles.emptyTitle, { fontSize: px(18), lineHeight: px(22) }]}>
            Order not found
          </Text>
          <Text style={[styles.emptyDetail, { fontSize: px(13), lineHeight: px(16) }]}>
            It may have been deleted from your history.
          </Text>
          <Button
            label="Back to orders"
            onPress={back}
            style={{ height: px(52), borderRadius: px(14), marginTop: px(8) }}
          />
        </View>
      ) : (
        <ScrollView
          style={styles.flex}
          contentContainerStyle={[
            styles.content,
            { paddingHorizontal: px(20), paddingTop: px(8), paddingBottom: px(24), gap: px(16) },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {/* Status strip — stage chip, timestamp and item count. */}
          <View style={[styles.status, { borderRadius: px(18), padding: px(16), gap: px(8) }]}>
            <View style={styles.statusRow}>
              <View style={[styles.pill, { paddingHorizontal: px(10), paddingVertical: px(5), borderRadius: px(999) }]}>
                <Text style={[styles.pillText, { fontSize: px(10), lineHeight: px(12) }]}>
                  {STAGES[order.stage] ?? 'Preparing'}
                </Text>
              </View>
              <Text style={[styles.stamp, { fontSize: px(12), lineHeight: px(15) }]}>
                {formatOrderStamp(order.timestamp)}
              </Text>
            </View>
            <Text style={[styles.statusHeadline, { fontSize: px(17), lineHeight: px(21) }]}>
              {items.length
                ? `${items.length} item${items.length === 1 ? '' : 's'} in this order`
                : 'Order summary'}
            </Text>
          </View>

          {/* Line items */}
          <View style={{ gap: px(10) }}>
            <Text style={[text.title, { color: color.brand, fontSize: px(18), lineHeight: px(22) }]}>
              Items
            </Text>
            {items.length === 0 ? (
              <Text style={[styles.emptyDetail, { fontSize: px(13), lineHeight: px(16) }]}>
                No item detail was stored for this order.
              </Text>
            ) : (
              items.map((item) => {
                const dish = MENU.find((d) => d.id === item.id);
                return (
                  <View key={item.id} style={[styles.item, { height: px(56) }]}>
                    {dish ? (
                      <Image
                        source={dish.image}
                        style={{ width: px(46), height: px(46), borderRadius: px(12) }}
                        resizeMode="cover"
                        accessibilityIgnoresInvertColors
                      />
                    ) : (
                      <View style={[styles.itemFallback, { width: px(46), height: px(46), borderRadius: px(12) }]}>
                        <Icon name="utensils" size={px(18)} color={color.brand} />
                      </View>
                    )}
                    <View style={styles.itemCopy}>
                      <Text numberOfLines={1} style={[styles.itemName, { fontSize: px(14), lineHeight: px(17) }]}>
                        {item.name}
                      </Text>
                      <Text style={[styles.itemQty, { fontSize: px(11), lineHeight: px(14) }]}>
                        Qty {item.qty}
                        {typeof item.price === 'number' ? ` · $${item.price} each` : ''}
                      </Text>
                    </View>
                    <Text style={[styles.itemPrice, { fontSize: px(14), lineHeight: px(17) }]}>
                      ${typeof item.price === 'number' ? item.qty * item.price : order.total}
                    </Text>
                  </View>
                );
              })
            )}
          </View>

          {/* Totals — `total` is the amount actually charged, so it is shown
              as-is rather than reconstructed from the rows above (the stored
              figure already folds in delivery and any voucher credit). */}
          <View style={[styles.summary, { borderRadius: px(18), padding: px(16), gap: px(10) }]}>
            <Row label="Items subtotal" value={`$${itemsTotal}`} />
            <View style={styles.divider} />
            <View style={styles.totalRow}>
              <Text style={[styles.totalLabel, { fontSize: px(14), lineHeight: px(17) }]}>Paid</Text>
              <Text style={[styles.totalValue, { fontSize: px(16), lineHeight: px(19) }]}>
                ${order.total}
              </Text>
            </View>
          </View>

          <Button
            label="Delete order"
            variant="brand"
            onPress={confirmDelete}
            style={{ height: px(52), borderRadius: px(14) }}
          />
        </ScrollView>
      )}
    </Screen>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  const { px } = useScale();
  return (
    <View style={styles.totalRow}>
      <Text style={[styles.rowLabel, { fontSize: px(12), lineHeight: px(15) }]}>{label}</Text>
      <Text style={[styles.rowValue, { fontSize: px(12), lineHeight: px(15) }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { flexGrow: 1 },
  status: { backgroundColor: color.muted },
  statusRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  pill: { backgroundColor: color.surface },
  pillText: { fontFamily: font.bold, color: color.brand },
  stamp: { fontFamily: font.regular, color: color.brand, opacity: 0.6, flexShrink: 1, textAlign: 'right' },
  statusHeadline: { fontFamily: font.regular, color: color.brand },
  item: { flexDirection: 'row', alignItems: 'center' },
  itemFallback: { backgroundColor: color.canvas, alignItems: 'center', justifyContent: 'center' },
  itemCopy: { flex: 1, paddingHorizontal: 12 },
  itemName: { fontFamily: font.regular, color: color.brand },
  itemQty: { fontFamily: font.regular, color: color.brand, opacity: 0.52 },
  itemPrice: { fontFamily: font.extraBold, color: color.accent },
  summary: { backgroundColor: color.muted },
  rowLabel: { fontFamily: font.medium, color: color.brand },
  rowValue: { fontFamily: font.regular, color: color.brand },
  divider: { height: 1, backgroundColor: color.surface },
  totalRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  totalLabel: { fontFamily: font.regular, color: color.brand },
  totalValue: { fontFamily: font.extraBold, color: color.accent },
  empty: { alignItems: 'center', justifyContent: 'center', paddingVertical: 40, gap: 10 },
  emptyTitle: { fontFamily: font.regular, color: color.brand },
  emptyDetail: { fontFamily: font.regular, color: color.brand, opacity: 0.6, textAlign: 'center' },
});
