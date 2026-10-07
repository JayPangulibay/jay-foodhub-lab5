import React from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { color, font, radius, text } from '../theme';
import { Screen } from '../components/Screen';
import { BottomNav, PageHeader } from '../components/Chrome';
import { Button, confirmDestructive } from '../components/Controls';
import { Icon } from '../components/Icon';
import { useScale } from '../components/scale';
import { useApp, useAuth, useNavigate } from '../state/AppContext';
import { formatOrderStamp, MENU, SAVINGS_TOTAL, STAGES } from '../data/menu';
import { parseOrderItems, type OrderRow } from '../services/db';

/**
 * The prototype has no Orders or More frame — these back the second and fifth
 * tab items so every tab lands somewhere real. Styled from the same tokens.
 */
export function OrdersScreen() {
  const { state, dispatch, subtotal, addOnTotal, delivery, discount, total, cartCount } = useApp();
  const navigate = useNavigate();
  const { px } = useScale();

  const lines = state.cart
    .map((line) => ({ ...line, dish: MENU.find((d) => d.id === line.dishId) }))
    .filter((l) => l.dish);
  const orders = state.orders;
  /** Both empty — nothing live and nothing stored. */
  const showEmpty = lines.length === 0 && orders.length === 0;

  const deleteOrder = (id: number) => {
    confirmDestructive({
      title: `Delete order #JF-${id}?`,
      message: 'This removes it from your history and cannot be undone.',
      confirmLabel: 'Delete',
      onConfirm: () => dispatch({ type: 'orderDeleted', id }),
    });
  };

  return (
    <Screen background={color.surface}>
      <PageHeader title="My Orders" trailing="more-horizontal" />

      <ScrollView
        style={styles.flex}
        contentContainerStyle={[styles.content, { padding: px(20), gap: px(14) }]}
        showsVerticalScrollIndicator={false}
      >
        {showEmpty ? (
          <View style={styles.empty}>
            <Icon name="receipt" size={px(40)} color={color.brand} />
            <Text style={[styles.emptyTitle, { fontSize: px(18), lineHeight: px(22) }]}>No orders yet</Text>
            <Text style={[styles.emptyDetail, { fontSize: px(13), lineHeight: px(16) }]}>
              Your cart is empty. Browse the menu to get started.
            </Text>
            <Button
              label="Browse menu"
              onPress={() => dispatch({ type: 'tab', tab: 'home' })}
              style={{ height: px(52), borderRadius: px(14), marginTop: px(8) }}
            />
          </View>
        ) : (
          <>
            {lines.length > 0 && (
              <>
                <View style={[styles.panel, { borderRadius: px(18), padding: px(16), gap: px(12) }]}>
                  <Text style={[styles.panelTitle, { fontSize: px(17), lineHeight: px(21) }]}>
                    {cartCount} item{cartCount === 1 ? '' : 's'} in your cart
                  </Text>
                  {lines.map((line) => (
                    <View key={line.dishId} style={styles.line}>
                      <Image
                        source={line.dish!.image}
                        style={{ width: px(46), height: px(46), borderRadius: px(12) }}
                        resizeMode="cover"
                        accessibilityIgnoresInvertColors
                      />
                      <View style={styles.lineCopy}>
                        <Text numberOfLines={1} style={[styles.lineName, { fontSize: px(14), lineHeight: px(17) }]}>
                          {line.dish!.name}
                        </Text>
                        <Text style={[styles.lineNote, { fontSize: px(11), lineHeight: px(14) }]}>
                          {line.dish!.note}
                        </Text>
                      </View>
                      <Text style={[styles.linePrice, { fontSize: px(14), lineHeight: px(17) }]}>
                        ${line.dish!.price * line.qty}
                      </Text>
                    </View>
                  ))}
                </View>

                <View style={[styles.panel, { borderRadius: px(18), padding: px(16), gap: px(10), backgroundColor: color.muted }]}>
                  <Row label="Subtotal" value={`$${subtotal}`} />
                  <Row label="Add-ons" value={`$${addOnTotal}`} />
                  <Row label="Delivery charge" value={`$${delivery}`} />
                  <Row label="Discount" value={`-$${discount}`} accent />
                  <View style={styles.divider} />
                  <View style={styles.totalRow}>
                    <Text style={[styles.totalLabel, { fontSize: px(14), lineHeight: px(17) }]}>Total</Text>
                    <Text style={[styles.totalValue, { fontSize: px(16), lineHeight: px(19) }]}>${total}</Text>
                  </View>
                </View>

                <Button
                  label="Track order"
                  onPress={() => navigate({ name: 'trackOrder' })}
                  style={{ height: px(52), borderRadius: px(14) }}
                />
                <Button
                  label="Add delivery address"
                  variant="brand"
                  onPress={() => navigate({ name: 'addAddress' })}
                  style={{ height: px(52), borderRadius: px(14) }}
                />
              </>
            )}

            {/* Stored history — rows written by PLACE_ORDER, read from SQLite. */}
            <View style={[styles.panel, { borderRadius: px(18), padding: px(16), gap: px(12) }]}>
              <Text style={[styles.panelTitle, { fontSize: px(17), lineHeight: px(21) }]}>
                My orders{orders.length > 0 ? ` (${orders.length})` : ''}
              </Text>
              {orders.length === 0 ? (
                <Text style={[styles.emptyDetail, { fontSize: px(13), lineHeight: px(16) }]}>
                  Orders you place will appear here.
                </Text>
              ) : (
                orders.map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    onOpen={() => navigate({ name: 'orderHistory', orderId: order.id })}
                    onDelete={() => deleteOrder(order.id)}
                  />
                ))
              )}
            </View>
          </>
        )}
      </ScrollView>

      <BottomNav active="orders" onSelect={(key) => dispatch({ type: 'tab', tab: key })} />
    </Screen>
  );
}

export function MoreScreen() {
  const { state, dispatch } = useApp();
  const { signedIn } = useAuth();
  const navigate = useNavigate();
  const { px } = useScale();

  const rows: { label: string; icon: Parameters<typeof Icon>[0]['name']; onPress: () => void }[] = [
    { label: 'Add delivery address', icon: 'map-pinned', onPress: () => navigate({ name: 'addAddress' }) },
    { label: 'Track your order', icon: 'bike', onPress: () => navigate({ name: 'trackOrder' }) },
    { label: 'Your savings', icon: 'tag', onPress: () => navigate({ name: 'savings' }) },
    { label: 'Activity', icon: 'bell', onPress: () => navigate({ name: 'activity' }) },
  ];

  return (
    <Screen background={color.surface}>
      <PageHeader title="More" />

      <ScrollView
        style={styles.flex}
        contentContainerStyle={[styles.content, { padding: px(20), gap: px(14) }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.panel, { borderRadius: px(18), padding: px(16), gap: px(6) }]}>
          <Text style={[styles.profileName, { fontSize: px(18), lineHeight: px(22) }]}>
            {state.address.name || 'Guest'}
          </Text>
          <Text style={[styles.profileMeta, { fontSize: px(12), lineHeight: px(15) }]}>
            {signedIn ? 'Signed in' : 'Not signed in'} · {SAVINGS_TOTAL}
          </Text>
        </View>

        <View style={[styles.panel, { borderRadius: px(18), padding: px(8) }]}>
          {rows.map((row) => (
            <Pressable
              key={row.label}
              accessibilityRole="button"
              accessibilityLabel={row.label}
              onPress={row.onPress}
              style={({ pressed }) => [styles.menuRow, { height: px(52), opacity: pressed ? 0.7 : 1 }]}
            >
              <View style={[styles.menuIcon, { width: px(34), height: px(34) }]}>
                <Icon name={row.icon} size={px(17)} color={color.brand} />
              </View>
              <Text style={[styles.menuLabel, { fontSize: px(14), lineHeight: px(17) }]}>{row.label}</Text>
              <Icon name="chevron-right" size={px(17)} color={color.brand} />
            </Pressable>
          ))}
        </View>

        <Button
          label={signedIn ? 'Sign out' : 'Sign in'}
          variant="brand"
          onPress={() => {
            if (signedIn) {
              dispatch({ type: 'reset' });
              navigate({ name: 'login' });
            } else {
              navigate({ name: 'login' });
            }
          }}
          style={{ height: px(52), borderRadius: px(14) }}
        />
      </ScrollView>

      <BottomNav active="more" onSelect={(key) => dispatch({ type: 'tab', tab: key })} />
    </Screen>
  );
}

function Row({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  const { px } = useScale();
  return (
    <View style={styles.line}>
      <Text style={[styles.rowLabel, { fontSize: px(12), lineHeight: px(15) }]}>{label}</Text>
      <Text
        style={[
          styles.rowValue,
          { fontSize: px(12), lineHeight: px(15), color: accent ? color.accent : color.brand },
        ]}
      >
        {value}
      </Text>
    </View>
  );
}

/**
 * One stored order: tappable for the full receipt, with an inline delete so a
 * single order can be cleared without opening it. `onOpen` and `onDelete` are
 * separate pressables — the inner one wins the touch, so the row never opens
 * while the user is deleting.
 */
function OrderCard({
  order,
  onOpen,
  onDelete,
}: {
  order: OrderRow;
  onOpen: () => void;
  onDelete: () => void;
}) {
  const { px } = useScale();
  const items = parseOrderItems(order.items);
  const summary = items.length
    ? items.map((item) => `${item.qty}× ${item.name}`).join(', ')
    : 'No item detail stored';
  const stage = STAGES[order.stage] ?? 'Preparing';

  return (
    <Pressable
      onPress={onOpen}
      accessibilityRole="button"
      accessibilityLabel={`Order JF-${order.id}, $${order.total}, ${stage}`}
      style={({ pressed }) => [
        styles.orderCard,
        { borderRadius: px(14), padding: px(10), gap: px(10), opacity: pressed ? 0.7 : 1 },
      ]}
    >
      <View style={styles.orderBadge}>
        <Icon name="receipt" size={px(17)} color={color.brand} />
      </View>

      <View style={styles.orderCopy}>
        <View style={styles.orderTitleRow}>
          <Text style={[styles.orderTitle, { fontSize: px(14), lineHeight: px(17) }]}>
            Order #JF-{order.id}
          </Text>
          <Text style={[styles.orderTotal, { fontSize: px(14), lineHeight: px(17) }]}>
            ${order.total}
          </Text>
        </View>
        <Text numberOfLines={1} style={[styles.orderSummary, { fontSize: px(12), lineHeight: px(15) }]}>
          {summary}
        </Text>
        <Text style={[styles.orderMeta, { fontSize: px(11), lineHeight: px(14) }]}>
          {formatOrderStamp(order.timestamp)} · {stage}
        </Text>
      </View>

      <Pressable
        onPress={onDelete}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel={`Delete order JF-${order.id}`}
        style={({ pressed }) => [styles.orderTrash, { opacity: pressed ? 0.6 : 1 }]}
      >
        <Icon name="trash" size={px(17)} color={color.accent} />
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { flexGrow: 1 },
  panel: { backgroundColor: color.surface },
  panelTitle: { fontFamily: font.regular, color: color.brand },
  orderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: color.canvas,
  },
  orderBadge: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: color.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orderCopy: { flex: 1, gap: 2 },
  orderTitleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  orderTitle: { fontFamily: font.bold, color: color.brand },
  orderTotal: { fontFamily: font.extraBold, color: color.accent },
  orderSummary: { fontFamily: font.regular, color: color.brand, opacity: 0.6 },
  orderMeta: { fontFamily: font.regular, color: color.brand, opacity: 0.45 },
  orderTrash: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: color.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  line: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  lineCopy: { flex: 1, paddingHorizontal: 12 },
  lineName: { fontFamily: font.regular, color: color.brand },
  lineNote: { fontFamily: font.regular, color: color.brand, opacity: 0.52 },
  linePrice: { fontFamily: font.extraBold, color: color.accent },
  rowLabel: { fontFamily: font.medium, color: color.brand },
  rowValue: { fontFamily: font.regular },
  divider: { height: 1, backgroundColor: color.muted },
  totalRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  totalLabel: { fontFamily: font.regular, color: color.brand },
  totalValue: { fontFamily: font.extraBold, color: color.accent },
  empty: { alignItems: 'center', justifyContent: 'center', paddingVertical: 40, gap: 10 },
  emptyTitle: { fontFamily: font.regular, color: color.brand },
  emptyDetail: { fontFamily: font.regular, color: color.brand, opacity: 0.6, textAlign: 'center' },
  profileName: { fontFamily: font.regular, color: color.brand },
  profileMeta: { fontFamily: font.regular, color: color.brand, opacity: 0.6 },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 8,
  },
  menuIcon: {
    borderRadius: radius.pill,
    backgroundColor: color.muted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuLabel: { flex: 1, fontFamily: font.regular, color: color.brand },
});
