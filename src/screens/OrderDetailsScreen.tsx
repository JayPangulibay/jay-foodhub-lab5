import React, { useEffect } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { color, font, shadow, text } from '../theme';
import { Screen } from '../components/Screen';
import { PageHeader } from '../components/Chrome';
import { Button, CheckCircle, Stepper } from '../components/Controls';
import { Icon } from '../components/Icon';
import { useScale } from '../components/scale';
import { useApp, useBack } from '../state/AppContext';
import { ADD_ONS, MENU, assets } from '../data/menu';

/**
 * Screen 3 — "Order Details"
 * Hero restaurant card, quantity stepper, add-on toggles and the summary panel,
 * finishing on the orange "Place my order" CTA.
 *
 * The summary is live (LABORATORY 5): subtotal is this dish's cart line
 * (qty × price), delivery is flat and the discount tracks the vouchers applied
 * on the Savings screen. The stepper writes straight through to the cart, so
 * moving it re-prices the panel and the basket on the Orders tab together.
 */
export function OrderDetailsScreen({ dishId }: { dishId: string }) {
  const { state, dispatch, addOnTotal, delivery, discount } = useApp();
  const back = useBack();
  const { px } = useScale();

  const dish = MENU.find((d) => d.id === dishId) ?? MENU[0];
  const line = state.cart.find((l) => l.dishId === dish.id);
  const qty = line?.qty ?? 1;

  // Viewing a dish means ordering it: make sure a line exists so the stepper
  // and the subtotal agree from the first frame.
  useEffect(() => {
    if (!line) dispatch({ type: 'cartSet', dishId: dish.id, qty: 1 });
  }, [dish.id, line, dispatch]);

  // Live summary — cart qty × price, plus add-ons, delivery and voucher credit.
  const subtotal = qty * dish.price;
  const total = Math.max(0, subtotal + addOnTotal + delivery - discount);

  return (
    <Screen background={color.surface}>
      <PageHeader title="Order Details" leading="chevron-left" onLeading={back} />

      <ScrollView
        style={styles.flex}
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: px(8),
            paddingBottom: px(24),
            paddingHorizontal: px(20),
            gap: px(16),
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Restaurant card — 156px photo over a 76px information strip. */}
        <View style={[styles.card, { borderRadius: px(24) }]}>
          <Image
            source={assets.orderHero}
            style={{ width: '100%', height: px(156) }}
            resizeMode="cover"
            accessibilityIgnoresInvertColors
          />
          <View style={[styles.cardInfo, { height: px(76), paddingHorizontal: px(16) }]}>
            <View style={[styles.cardCopy, { gap: px(5) }]}>
              <Text style={[styles.cardTitle, { fontSize: px(17), lineHeight: px(21) }]}>
                {dish.name}
              </Text>
              <View style={styles.rating}>
                <Icon name="star" size={px(15)} color={color.accent} filled />
                <Text style={[styles.ratingText, { fontSize: px(11), lineHeight: px(13) }]}>
                  4.7 (2.3k)
                </Text>
              </View>
            </View>
            <Text style={[styles.cardPrice, { fontSize: px(18), lineHeight: px(22) }]}>
              ${dish.price}
            </Text>
          </View>
        </View>

        {/* Your order */}
        <View style={{ gap: px(10) }}>
          <Text style={[text.title, { color: color.brand, fontSize: px(18), lineHeight: px(22) }]}>
            Your order
          </Text>
          <View style={[styles.orderRow, { height: px(46) }]}>
            <View style={[styles.orderCopy, { gap: px(3) }]}>
              <Text style={[styles.orderName, { fontSize: px(13), lineHeight: px(16) }]}>
                {dish.name}
              </Text>
              <Text style={[styles.orderVariant, { fontSize: px(10), lineHeight: px(12) }]}>
                Regular bowl
              </Text>
            </View>
            <Stepper
              value={qty}
              onChange={(value) => dispatch({ type: 'cartSet', dishId: dish.id, qty: value })}
              min={1}
            />
          </View>
        </View>

        {/* Add-ons */}
        <View style={{ gap: px(9) }}>
          <Text style={[text.body, { color: color.brand, fontSize: px(14), lineHeight: px(17) }]}>
            Add-ons
          </Text>
          {ADD_ONS.map((addOn) => {
            const on = !!state.addOns[addOn.id];
            return (
              <Pressable
                key={addOn.id}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: on }}
                accessibilityLabel={`${addOn.label}, $${addOn.price}`}
                onPress={() => dispatch({ type: 'toggleAddOn', id: addOn.id })}
                style={({ pressed }) => [
                  styles.addOnRow,
                  { height: px(20), opacity: pressed ? 0.7 : 1 },
                ]}
              >
                <View style={styles.addOnLabel}>
                  <CheckCircle checked={on} size={px(20)} />
                  <Text style={[styles.addOnName, { fontSize: px(12), lineHeight: px(15) }]}>
                    {addOn.label}
                  </Text>
                </View>
                <Text style={[styles.addOnPrice, { fontSize: px(12), lineHeight: px(15) }]}>
                  ${addOn.price}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Summary panel */}
        <View style={[styles.summary, { borderRadius: px(18), padding: px(16), gap: px(10) }]}>
          <SummaryRow label="Subtotal" value={`$${subtotal}`} />
          <SummaryRow label="Delivery charge" value={`$${delivery}`} />
          <SummaryRow label="Discount" value={`-$${discount}`} tone="accent" />
          <View style={styles.divider} />
          <View style={styles.summaryTotal}>
            <Text style={[styles.totalLabel, { fontSize: px(14), lineHeight: px(17) }]}>Total</Text>
            <Text style={[styles.totalValue, { fontSize: px(16), lineHeight: px(19) }]}>
              ${total}
            </Text>
          </View>
        </View>

        <Button
          label="Place my order"
          onPress={() => dispatch({ type: 'placeOrder' })}
          style={{ height: px(52), borderRadius: px(14) }}
        />
        <Text style={styles.footnote}>
          Add-ons today {addOnTotal > 0 ? `$${addOnTotal}` : '$0'}
        </Text>
      </ScrollView>
    </Screen>
  );
}

function SummaryRow({ label, value, tone }: { label: string; value: string; tone?: 'accent' }) {
  const { px } = useScale();
  const valueColor = tone === 'accent' ? color.accent : color.brand;
  return (
    <View style={styles.summaryRow}>
      <Text style={[styles.summaryLabel, { fontSize: px(12), lineHeight: px(15) }]}>{label}</Text>
      <Text style={[styles.summaryValue, { color: valueColor, fontSize: px(12), lineHeight: px(15) }]}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { flexGrow: 1 },
  card: {
    backgroundColor: color.surface,
    overflow: 'hidden',
    ...shadow.card,
  },
  cardInfo: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  cardCopy: { justifyContent: 'center' },
  cardTitle: { fontFamily: font.regular, color: color.brand },
  rating: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  ratingText: { fontFamily: font.bold, color: color.brand },
  cardPrice: { fontFamily: font.regular, color: color.accent },
  orderRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  orderCopy: { justifyContent: 'center' },
  orderName: { fontFamily: font.bold, color: color.brand },
  orderVariant: { fontFamily: font.regular, color: color.brand, opacity: 0.52 },
  addOnRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  addOnLabel: { flexDirection: 'row', alignItems: 'center', gap: 9 },
  addOnName: { fontFamily: font.regular, color: color.brand },
  addOnPrice: { fontFamily: font.regular, color: color.accent },
  summary: { backgroundColor: color.muted },
  summaryRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  summaryLabel: { fontFamily: font.medium, color: color.brand },
  summaryValue: { fontFamily: font.regular },
  divider: { height: 1, backgroundColor: color.muted },
  summaryTotal: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  totalLabel: { fontFamily: font.regular, color: color.brand },
  totalValue: { fontFamily: font.extraBold, color: color.accent },
  footnote: {
    fontFamily: font.regular,
    fontSize: 9,
    color: color.brand,
    opacity: 0.4,
    textAlign: 'center',
  },
});
