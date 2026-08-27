# Image attributions

## ACTS sector artwork (client-supplied)

Supplied by ACTS and used for the industry tabs on `/industries` and the client
portfolio tabs on `/projects`. No third-party licence applies — these replaced
the Wikimedia stock that previously stood in for them.

The files below are the **sources**, and they live in
`2026-08-14/images/sector-sources/` — outside `public/`, because nothing in the
app loads them and 7 MB of full-size originals on the CDN is pure deploy weight.
`scripts/normalize-sector-images.mjs` derives `public/images/sectors/*.jpg` from
them, and that is what the pages load. Re-run the script after replacing any
source.

| Source | Derivative | Kind | Used by |
| --- | --- | --- | --- |
| Oil and Gas.png | sectors/oil-gas.jpg | photo | industries: oil-gas |
| Petrochemicals.jpg | sectors/petrochemicals.jpg | photo | industries: petrochemical · projects: petrochemicals |
| Water Treatement.jpg | sectors/water-treatment.jpg | photo | industries: water-treatment |
| Fertlizers.jpg | sectors/fertilizers.jpg | photo | industries: fertilizers · projects: fertilizers |
| Power Generation.jpg | sectors/power-generation.jpg | emblem | industries: power-generation |
| General industries.jpg | sectors/general-industrial.jpg | emblem | industries: general-industrial |
| Oil and gas logo.jpg | sectors/upstream.jpg | emblem | projects: upstream |
| Oil and gas logo midstreaming.jpg | sectors/midstream.jpg | emblem | projects: midstream |
| EPC.jpg | sectors/epc.jpg | emblem | projects: epc |

"photo" fills its panel edge to edge; "emblem" is square icon art held
object-contain on a cream plate. See `components/SectorPanel.tsx`.

Known quality gap: **Fertlizers.jpg is only 572×395**, far below the ~1600px the
panel can ask for, so it renders visibly softer than the other three
photographs. Replace it with a higher-resolution shot when one is available and
re-run the script — nothing else needs to change.

## Client logos

`clients/*.png` are the customers' own marks, reproduced to identify them as
ACTS clients. Not ACTS property. The originals they were cut from are archived
in `2026-08-14/clients-logo-sources/`; only the normalised `clients/*.png` are
served.

## Generic industrial stock (Wikimedia Commons)

Free-licensed (CC BY / CC BY-SA / public domain). If the site goes to
production, verify each license on the source page and add attribution in the
site footer or an /attributions page as required — or replace with ACTS' own
photography.

### Still in use

| File | Source | License | Used by |
| --- | --- | --- | --- |
| refinery-blue.jpg | https://commons.wikimedia.org/wiki/File:Blue_hour_fog_over_Preemraff_oil_refinery_by_Brofjorden.jpg | CC BY-SA | /brands/[slug] · Open Graph card |
| farris-relief-valves.jpg | https://commons.wikimedia.org/wiki/File:Safety_valve_ZHEJIANG_SHUANGTAI_VALVE.jpg | CC BY-SA 3.0 | brand record: farris-engineering |
| dynaflo-control-valve.jpg | https://commons.wikimedia.org/wiki/File:Small_industrial_control_valve.jpg | CC BY-SA 4.0 | brand record: dyna-flo |
| est-field-service.jpg | https://commons.wikimedia.org/wiki/File:Bench_welding_a_3%E2%80%9D_pipe_to_be_installed_in_the_ceiling_of_the_future_LIRR_passenger_concourse._(CM014B_02-12-2019)_(47051373892).jpg | CC BY 2.0 | brand record: est |

### No longer referenced

These six carried the industry and client-portfolio tabs before the ACTS
artwork above replaced them. Nothing in `app/`, `lib/`, or `components/` loads
them any more, so they have been moved out of `public/` to
`2026-08-14/images/unused-photos/`. They are kept only so the swap can be
reverted, and can be deleted once the new artwork is signed off.

| File | Source | License |
| --- | --- | --- |
| hero-plant.jpg | https://commons.wikimedia.org/wiki/File:Godorf_Station_at_Dusk,_May_2018.jpg | CC BY-SA |
| offshore-rig.jpg | https://commons.wikimedia.org/wiki/File:Jack-up-rig-in-the-caspian-sea_1.JPG | CC BY-SA |
| gas-plant.jpg | https://commons.wikimedia.org/wiki/File:Solohiv_natural_gas_plant_-_christmas_tree_3B.jpg | CC BY-SA |
| power-station.jpg | https://commons.wikimedia.org/wiki/File:Rostock_Power_Station,_SW_view.jpg | CC BY-SA |
| upstream-drilling-rig.jpg | https://commons.wikimedia.org/wiki/File:Williston_North_Dakota_Oil_Field_Oil_Rig_(5894614162).jpg | CC BY 2.0 |
| petrochemical-plant.jpg | https://commons.wikimedia.org/wiki/File:Mossmorran_Petrochemical_Plant_-_geograph.org.uk_-_7756043.jpg | CC BY-SA 2.0 |
