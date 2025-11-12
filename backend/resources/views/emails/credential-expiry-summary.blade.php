<x-mail::message>
# Daily Credential Expiry Summary

Hello Admin,

This is your daily summary of credentials expiring within the next 30 days.

**Total Credentials Expiring Soon:** {{ $credentials->count() }}

@if($credentials->count() > 0)
<x-mail::table>
| Candidate Name | Position | Credential Type | Expiry Date | Days Until Expiry | Status |
|:--------------|:---------|:----------------|:------------|:------------------|:-------|
@foreach($credentials as $credential)
@php
    $daysUntilExpiry = now()->startOfDay()->diffInDays($credential->expiry_date->startOfDay(), false);
    $status = $daysUntilExpiry <= 0 ? 'Expired' : ($daysUntilExpiry <= 7 ? 'Urgent' : ($daysUntilExpiry <= 14 ? 'Warning' : 'Notice'));
@endphp
| {{ $credential->candidate_name }} | {{ $credential->position }} | {{ $credential->credential_type }} | {{ $credential->expiry_date->format('M d, Y') }} | {{ $daysUntilExpiry }} day(s) | {{ $status }} |
@endforeach
</x-mail::table>

<x-mail::panel>
**Action Required:** Please review and take necessary action on the credentials listed above.
</x-mail::panel>
@else
<x-mail::panel>
✅ **Good News:** No credentials are expiring within the next 30 days.
</x-mail::panel>
@endif

Thanks,<br>
{{ config('app.name') }}
</x-mail::message>
